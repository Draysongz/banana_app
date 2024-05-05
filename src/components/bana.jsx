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
  Center,
} from "@chakra-ui/react";
import Image from "next/image";
import logo from "../images/logobanana.png";

export default function Bana() {
  return (
    <>
      <Stack
        bg={"#0dcaf0"}
        rounded={"full"}
        w="600px"
        align={"center"}
        justify="center"
      >
        <Stack align={"center"}>
          <Button justifySelf={"end"}>SELECT WALLET</Button>
          <Image src={logo} placeholder="blur" quality={100} sizes="50vw" />
        </Stack>
        <Divider />
        <Stack>
          <Text>
            The SOL reward pool with the richest daily return and lowest dev
            fee, daily income of up to 8%, and a referral bonus of up to 12%
            (documentation)
          </Text>
          <Text>
            #1 - BUY BANANA: Start by using your SOL to purchase bananas.
          </Text>
          <Text>
            #2 - COMPOUND: To maximize your earnings, click on the "COMPOUND"
            button. This action will automatically reinvest your rewards back
            into BANANA.
          </Text>
          <Text>
            #3 - CLAIM REWARDS: This will transfer your accumulated SOL rewards
            directly into your wallet
          </Text>
          <Text>
            The key to maximizing your rewards lies in the quantity of bananas
            you hold and how frequently you compound them. The more bananas you
            accumulate and the more often you reinvest your rewards, the greater
            the potential for earning more rewards
          </Text>
        </Stack>
        <Box>
          <TableContainer p={2} borderRadius={"lg"}>
            <Table variant="simple">
              <Tbody>
                <Tr>
                  <Td fontSize="xs">TVL</Td>
                  <Td isNumeric align="center">
                    0.00 $
                  </Td>
                </Tr>
                <Tr>
                  <Td fontSize="xs">Contract</Td>
                  <Td isNumeric>0 SOL</Td>
                </Tr>
                <Tr>
                  <Td fontSize="xs">Wallet</Td>
                  <Td isNumeric>0 SOL</Td>
                </Tr>
                <Tr>
                  <Td fontSize="xs">Your Bananas</Td>
                  <Td isNumeric>0 BANANAS</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <NumberInput>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
              <Text>SOL</Text>
            </NumberInputStepper>
          </NumberInput>
          <Button>BUY BANANA</Button>
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
          <Card mb={5}>
            <CardBody>
              <Heading>Nutritional Values</Heading>
              <TableContainer p={2} borderRadius={"lg"}>
                <Table variant="simple">
                  <Tbody>
                    <Tr>
                      <Td fontSize="xs">Daily Return</Td>
                      <Td isNumeric align="center">
                        8%
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontSize="xs">APR</Td>
                      <Td isNumeric>2,920%</Td>
                    </Tr>
                    <Tr>
                      <Td fontSize="xs">Dev Fee</Td>
                      <Td isNumeric>5%</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Heading>Nutritional Values</Heading>
              <TableContainer p={2} borderRadius={"lg"}>
                <Table variant="simple">
                  <Tbody>
                    <Tr>
                      <Td fontSize="xs">Daily Return</Td>
                      <Td isNumeric align="center">
                        8%
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontSize="xs">APR</Td>
                      <Td isNumeric>2,920%</Td>
                    </Tr>
                    <Tr>
                      <Td fontSize="xs">Dev Fee</Td>
                      <Td isNumeric>5%</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Button>COPY TO CLIPBOARD</Button>
              <Text>
                Earn 12% of the SOL used to compound from anyone who uses your
                referral link
              </Text>
            </CardBody>
          </Card>
        </Box>
      </Stack>
    </>
  );
}
