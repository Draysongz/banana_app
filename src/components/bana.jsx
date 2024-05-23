import {
  Box,
  Stack,
  Button,
  Container,
  Divider,
  Text,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Icon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ButtonGroup,
  Card,
  CardBody,
  Heading,
  useColorModeValue,
  Input,
  Flex,
} from "@chakra-ui/react";
import Image from "next/image";
import logo from "../images/logobanana.png";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { app, db } from "../../Firebase/firebase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useFarmFactory } from "@/hooks/useFarmFactory";
import { useFarmWallet } from "@/hooks/useFarmWallet";
import { fromNano } from "@ton/core";
export default function Bana() {
  const { initializeFarmContract, totalValueLocked, farmWalletStatus } =
    useFarmFactory();
  const {
    userStakedBalance,
    userWalletBalance,
    currRewards,
    stake,
    unstake,
    compound,
    claimRewards,
  } = useFarmWallet();
  const { connected, userAddress } = useTonConnect();
  const client = useTonClient();
  const [referralLink, setReferralLink] = useState("");
  const [userId, setUserId] = useState("");
  const walletAddress = userAddress;
  const router = useRouter();
  const { code } = router.query;

  const [amount, setAmount] = useState(0);
  const [reward, setReward] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [userDeets, setUserDeets] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    // Function to fetch user data and subscribe to real-time updates
    const fetchUserData = async () => {
      if (!walletAddress) return; // Exit early if walletAddress is not set

      const q = query(
        collection(db, "users"),
        where("walletAddress", "==", walletAddress)
      );

      // Subscribe to real-time updates using onSnapshot
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const user = querySnapshot.docs[0];
          setUserId(user.id);
          setUserDeets(user.data());
        } else {
          setUserId(""); // Clear userId if user not found
          setUserDeets(null); // Clear userDeets if user not found
          console.log("User not found for wallet address:", walletAddress);
        }
      });

      // Return the unsubscribe function to clean up the listener
      return unsubscribe;
    };

    // Call fetchUserData when walletAddress changes
    const unsubscribe = () => {
      fetchUserData();
    };

    // Clean up the listener when component unmounts or walletAddress changes
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Invoke the unsubscribe function to detach listener
      }
    };
  }, [walletAddress]);

  useEffect(() => {
    const registerWithReferral = async () => {
      if (!code || !walletAddress) return;

      // Check if the registration cookie exists
      const registrationDone = Cookies.get("registrationDone");
      if (registrationDone) {
        console.log("Referral registration already done.");
        return;
      }

      try {
        const q = query(
          collection(db, "users"),
          where("referralCode", "==", code)
        );
        const referrerSnapshot = await getDocs(q);

        if (referrerSnapshot.empty) {
          console.error("Invalid referral code");
          return;
        }

        const referrer = referrerSnapshot.docs[0];
        const referrerId = referrer.id;

        // Generate a unique user ID for the new user
        const userId = uuidv4();

        await setDoc(doc(db, "users", userId), {
          walletAddress,
          referralCode: null, // New users do not have referral codes initially
          rewards: 0,
        });

        await addDoc(collection(db, "referrals"), {
          referrerId,
          refereeId: userId,
        });

        setUserId(userId);

        // Set registration cookie to persist for 1 year
        Cookies.set("registrationDone", "true", { expires: 365 });
      } catch (error) {
        console.error("Error registering user with referral:", error.message);
      }
    };

    // Register user with referral on component mount
    registerWithReferral();
  }, [code, walletAddress]);

  useEffect(() => {
    const checkExistingReferralLink = async () => {
      if (!walletAddress) return;

      const q = query(
        collection(db, "users"),
        where("walletAddress", "==", walletAddress)
      );

      try {
        const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const existingReferralCode = userDoc.data().referralCode;
            if (existingReferralCode == null) {
              setReferralLink("");
              setUserId("");
            } else {
              const existingReferralLink = `https://notminer-git-master-brandai.vercel.app/?code=${existingReferralCode}`;
              setReferralLink(existingReferralLink);
              setUserId(userDoc.id);
            }
          }
        });

        // Store unsubscribe function in state
        setUnsubscribe(() => unsubscribeSnapshot);
      } catch (error) {
        console.error("Error setting up Firestore listener:", error.message);
        toast.error("Error setting up referral link listener.");
      }
    };

    // Call function to start listening
    checkExistingReferralLink();

    // Clean-up function to unsubscribe
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Invoke the unsubscribe function
        setUnsubscribe(null); // Clear unsubscribe function after detaching
      }
    };
  }, [walletAddress]); // Added referralLink as a dependency to monitor changes

  const handleStake = async () => {
    const q = query(
      collection(db, "referrals"),
      where("refereeId", "==", userId)
    );
    const referralSnapshot = await getDocs(q);

    if (referralSnapshot.empty) {
      console.error("No referrer found");
      return;
    }

    const referral = referralSnapshot.docs[0];
    const referrerId = referral.data().referrerId;
    const rewardAmount = amount * 0.05;

    const referrerDocRef = doc(db, "users", referrerId);
    await updateDoc(referrerDocRef, {
      rewards: increment(rewardAmount),
    });

    setReward(rewardAmount);
  };

  const getRewards = async () => {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists) {
      console.error("User not found");
      return;
    }

    setRewards(userDoc.data().rewards);
  };

  const generateReferralLink = async () => {
    if (referralLink) {
      toast.warning("Referaal link exists");
      return;
    }

    const userId = uuidv4(); // Generate a unique user ID
    const referralCode = uuidv4(); // Generate a unique referral code
    let processingToast;

    try {
      // Show processing toast
      processingToast = toast.promise(
        new Promise((resolve) => {
          setTimeout(resolve, 3000); // Simulating processing time
        }),
        {
          pending: "Generating referral link...",
          success: "Referral link generated successfully!",
          error: "Failed to generate referral link. Please try again later.",
          autoClose: 3000, // Close notification after 3 seconds
        }
      );

      await setDoc(
        doc(db, "users", userId),
        {
          walletAddress,
          referralCode,
          rewards: 0,
        },
        { merge: true }
      );

      const newReferralLink = `https://notminer-git-master-brandai.vercel.app/?code=${referralCode}`;
      setReferralLink(newReferralLink);
      setUserId(userId);

      // Resolve the processing toast with success message
      toast.update(processingToast, {
        render: "success",
        autoClose: 3000, // Close success notification after 3 seconds
      });
    } catch (error) {
      console.error("Error generating referral link:", error.message);

      // Resolve the processing toast with error message
      toast.update(processingToast, {
        render: "error",
        autoClose: 3000, // Close error notification after 3 seconds
      });
    }
  };

  return (
    <>
      <Stack
        m={10}
        maxH={"auto"}
        maxW={{ base: "md", md: "2xl" }}
        bg={"grey"}
        boxShadow="0 0 10px 5px rgba(48, 18, 135, 0.5)"
        background={"rgba(255,255,255, 0.7)"}
        borderRadius="lg"
        align={"center"}
        justify="center"
        p={10}
      >
        <Stack align={"center"}>
          <TonConnectButton />
          <Image
            src={logo}
            placeholder="blur"
            alt="logo"
            quality={100}
            sizes="50vw"
          />
        </Stack>
        <Divider />
        <Stack gap={2}>
          <Text textAlign={"center"}>
            <b>
              The TON reward pool with the richest daily return and lowest dev
              fee, daily income of up to 8%, and a referral bonus of up to 12%
              (documentation)
            </b>
          </Text>
          <Stack
            gap={0}
            textAlign={"normal"}
            justify="normal"
            px={{ base: 5, md: 20 }}
          >
            <Text>
              <b> #1 - STAKE NOT</b>: Start by staking NOT to earn TON
            </Text>
            <Text>
              <b>#2 - COMPOUND</b>: To maximize your earnings, click on the
              &ldquo;COMPOUND&rdquo; button. This action will automatically
              reinvest your rewards back into Tonzi.
            </Text>
            <Text>
              <b>#3 - CLAIM REWARDS</b>: This will transfer your accumulated SOL
              rewards directly into your wallet
            </Text>
          </Stack>
          <Text textAlign={"center"}>
            The key to maximizing your rewards lies in the quantity of Tonzis
            you hold and how frequently you compound them. The more Tonzis you
            accumulate and the more often you reinvest your rewards, the greater
            the potential for earning more rewards
          </Text>
        </Stack>
        <Box mt={10}>
          <Stack align={"center"} gap={5}>
            <Card
              maxW="md"
              boxShadow="0 0 10px 5px rgba(48, 18, 135, 0.5)"
              background={"rgba(255,255,255, 0.3)"}
              borderRadius="lg"
            >
              <CardBody align={"center"}>
                <TableContainer p={2} borderRadius={"lg"}>
                  <Table variant="simple">
                    <Tbody>
                      <Tr justifyContent={"space-between"}>
                        <Td fontSize="xs">TVL</Td>
                        <Td isNumeric align="center">
                          0.00 $
                        </Td>
                      </Tr>
                      <Tr justifyContent={"space-between"}>
                        <Td fontSize="xs">Contract</Td>
                        <Td isNumeric>{fromNano(totalValueLocked)} NOT</Td>
                      </Tr>
                      <Tr justifyContent={"space-between"}>
                        <Td fontSize="xs">Wallet</Td>
                        <Td isNumeric>{fromNano(userWalletBalance)} NOT</Td>
                      </Tr>
                      <Tr justifyContent={"space-between"}>
                        <Td fontSize="xs">Your NOT</Td>
                        <Td isNumeric>{fromNano(userStakedBalance)} NOT</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <Flex justifyContent={"space-around"} align="center">
                  <NumberInput onChange={(e) => setAmount(Number(e))}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>NOT</Text>
                </Flex>

                <Button
                  m={2}
                  onClick={() =>
                    farmWalletStatus == 0
                      ? initializeFarmContract()
                      : stake(amount)
                  }
                >
                  {farmWalletStatus == 0 ? "initialize" : "Stake NOT"}
                </Button>
                <Button m={2} onClick={() => unstake(amount)}>
                  Unstake
                </Button>
                <Divider />
                <TableContainer p={2} borderRadius={"lg"}>
                  <Table variant="simple">
                    <Tbody>
                      <Tr>
                        <Td fontSize="xs">Your Rewards</Td>
                        <Td isNumeric align="center">
                          {fromNano(currRewards)} NOT
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <ButtonGroup>
                  <Button onClick={() => compound()}>COMPOUND</Button>
                  <Button onClick={() => claimRewards()}>CLAIM REWARDS</Button>
                </ButtonGroup>
              </CardBody>
            </Card>
            <Card
              maxW="sm"
              boxShadow="0 0 10px 5px rgba(48, 18, 135, 0.5)"
              background={"rgba(255,255,255, 0.3)"}
              borderRadius="lg"
            >
              <CardBody align={"center"} justifyContent="space-between">
                <Heading>Nutritional Values</Heading>
                <Divider />
                <Stack>
                  <Text>
                    Daily Return..........................................6%
                  </Text>
                  <Text>
                    APR..................................................2,920%
                  </Text>
                  <Text>
                    Dev Fee...................................................5%
                  </Text>
                </Stack>
              </CardBody>
            </Card>
            <Card
              maxW="sm"
              background={"rgba(255,255,255, 0.3)"}
              boxShadow="0 0 10px 5px rgba(48, 18, 135, 0.5)"
              borderRadius="lg"
              gap={2}
            >
              <CardBody align={"center"}>
                <Heading>Referral Link</Heading>
                <Input value={referralLink} isDisabled />
                <Button
                  onClick={() => {
                    if (!referralLink) {
                      generateReferralLink();
                    } else if (referralLink != null) {
                      navigator.clipboard.writeText(referralLink);
                      toast.success("referral link copied");
                    }
                  }}
                >
                  {referralLink != "" && referralLink != null
                    ? "COPY TO CLIPBOARD"
                    : "Generate Referal Link"}
                </Button>
                <Text>
                  Earn 12% of the SOL used to compound from anyone who uses your
                  referral link
                </Text>
              </CardBody>
            </Card>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
