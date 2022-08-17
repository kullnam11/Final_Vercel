import { Box, FormControl, Heading, HStack, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils';
import React, { ChangeEvent, useState } from 'react';
import { LINK, LOTTERY_FACTORY } from '../../address';
import { LoadingSVG } from '../../assets/Loading';
import { isNumeric } from '../../utils/number';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Input from '../../components/Input';
import { useERC20ContractFunction, useTokenERC20Balance } from '../../contracts/ERC20/hooks';

const FormApproveNFT: React.FC = () => {
  const [amount, setAmount] = useState('');
  const { account } = useWeb3React();
  const [isSending, setSending] = useState(false);

  const approve = useERC20ContractFunction(LINK, 'approve');

  const { balance: bigTokenLinkBalance, fetch } = useTokenERC20Balance(LINK, account);

  // console.log(bigTokenLinkBalance);

  const tokenLinkBalance = formatUnits(bigTokenLinkBalance, 18);

  const handleAmountChange = (elm: ChangeEvent<HTMLInputElement>) => {
    setAmount(elm.target.value);
  };

  const handleApprove = async () => {
    const bigAmount = parseEther(amount);
    try {
      setSending(true);
      const txResult = await approve.send(LOTTERY_FACTORY, bigAmount);
      console.log(txResult);
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
   
  };
  const approveVal = !amount
  ? ''
  : !isNumeric(amount)
  ? 'Must be a number'
  : '';
  return (
    <>
      <Box>
        <Container>
          <Box className="c-box-border">
            <Box>
              <Heading as="h2" fontSize={'24px'}>
                2. Approve LINK
              </Heading>
              <Text fontSize={'.75rem'} color="gray">
                You'll also need LINK tokens to pay the ChainLink network in order to randomly select a lottery winner.
                You can learn more about ChainLink's verifiable randomness here, and you can get LINK tokens using a DEX
                aggregator like Matcha.
              </Text>
            </Box>

            <Box paddingTop={'0.5rem'}>
              <FormControl>
                <Box>
                  <Input name="amount" label="Amout" type="text" value={amount} helperText={approveVal} onChange={handleAmountChange} />
                </Box>
                <Box>
                  <Text>Your LINK Balance: {tokenLinkBalance}</Text>
                  <HStack gap="2rem">
                    <Button colorScheme={'blue'} onClick={handleApprove} disabled={isSending}>
                      Link Approved {isSending && <LoadingSVG />}
                    </Button>
                    {approve.state.status !== 'None' && <Text color="red.300">State: {approve.state.status}</Text>}
                  </HStack>
                </Box>
              </FormControl>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default FormApproveNFT;
