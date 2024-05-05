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

export default function Bana() {
  return (
    <>
      <Stack
        m={10}
        maxH={"auto"}
        maxW={{ base: "md", md: "2xl" }}
        bg={"grey"}
        border="2px solid"
        borderColor={useColorModeValue("#EDE8FC", "#301287")}
        boxShadow="0 0 10px 5px rgba(48, 18, 135, 0.5)"
        borderRadius="lg"
        align={"center"}
        justify="center"
        p={10}
      >
        <Stack align={"center"}>
          <Button alignSelf={"end"}>SELECT WALLET</Button>
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
              The SOL reward pool with the richest daily return and lowest dev
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
              <b> #1 - BUY BANANA</b>: Start by using your SOL to purchase
              bananas.
            </Text>
            <Text>
              <b>#2 - COMPOUND</b>: To maximize your earnings, click on the
              `&quot`COMPOUND`&quot` button. This action will automatically
              reinvest your rewards back into BANANA.
            </Text>
            <Text>
              <b>#3 - CLAIM REWARDS</b>: This will transfer your accumulated SOL
              rewards directly into your wallet
            </Text>
          </Stack>
          <Text textAlign={"center"}>
            The key to maximizing your rewards lies in the quantity of bananas
            you hold and how frequently you compound them. The more bananas you
            accumulate and the more often you reinvest your rewards, the greater
            the potential for earning more rewards
          </Text>
        </Stack>
        <Box>
          <Stack align={"center"} gap={5}>
            <Card
              maxW="md"
              border="2px solid #EDE8FC"
              boxShadow="0 0 10px 5px rgba(48, 18, 135, 0.5)"
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
                        <Td isNumeric>0 SOL</Td>
                      </Tr>
                      <Tr justifyContent={"space-between"}>
                        <Td fontSize="xs">Wallet</Td>
                        <Td isNumeric>0 SOL</Td>
                      </Tr>
                      <Tr justifyContent={"space-between"}>
                        <Td fontSize="xs">Your Bananas</Td>
                        <Td isNumeric>0 BANANAS</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <Flex justifyContent={"space-around"} align="center">
                  <NumberInput>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>SOL</Text>
                </Flex>

                <Button m={2}>BUY BANANA</Button>
                <Divider />
                <TableContainer p={2} borderRadius={"lg"}>
                  <Table variant="simple">
                    <Tbody>
                      <Tr>
                        <Td fontSize="xs">Your Rewards</Td>
                        <Td isNumeric align="center">
                          0 SOL
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <ButtonGroup>
                  <Button>COMPOUND</Button>
                  <Button>CLAIM REWARDS</Button>
                </ButtonGroup>
              </CardBody>
            </Card>
            <Card
              maxW="sm"
              border="2px solid #EDE8FC"
              boxShadow="0 0 10px 5px rgba(48, 18, 135, 0.5)"
              borderRadius="lg"
            >
              <CardBody align={"center"} justifyContent="space-between">
                <Heading>Nutritional Values</Heading>
                <Divider />
                <Stack>
                  <Text>
                    Daily Return..........................................8%
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
              border="2px solid #EDE8FC"
              boxShadow="0 0 10px 5px rgba(48, 18, 135, 0.5)"
              borderRadius="lg"
              gap={2}
            >
              <CardBody align={"center"}>
                <Heading>Referral Link</Heading>
                <Input placeholder="Referral Link Here" />
                <Button>COPY TO CLIPBOARD</Button>
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
