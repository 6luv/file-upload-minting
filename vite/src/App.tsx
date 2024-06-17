import { Button, Flex, Text } from "@chakra-ui/react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Contract, JsonRpcSigner, ethers } from "ethers";
import mintContractAbi from "./mintContractAbi.json";
import axios from "axios";

const App: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [mintContract, setMintContract] = useState<Contract | null>(null);

  const onClickMetamaask = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      setSigner(await provider.getSigner());
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.currentTarget.files) return;

      const formData = new FormData();
      formData.append("file", e.currentTarget.files[0]);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "pultipart/form-data",
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!signer) return;

    setMintContract(
      new Contract(
        "0xABed627BABa39ce1b6a6B56b6257De476c5055e5",
        mintContractAbi,
        signer
      )
    );
  }, [signer]);

  return (
    <Flex
      bgColor="red.100"
      w="100%"
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
    >
      {signer ? (
        <>
          <Text>{signer.address}</Text>
          <input type="file" onChange={onChangeFile} />
        </>
      ) : (
        <Button onClick={onClickMetamaask}>로그인</Button>
      )}
    </Flex>
  );
};

export default App;
