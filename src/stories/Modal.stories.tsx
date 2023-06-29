import { ArweaveWalletKit } from "../components/Provider";
import { Modal } from "../components/Modal/Modal";
import { Head } from "../components/Modal/Head";
import { Footer } from "../components/Modal/Footer";
import { Title, TitleWithParagraph } from "../components/Title";
import { Paragraph } from "../components/Paragraph";
import { Button } from "../components/Button";
import { Application } from "../components/Application";
import useModal from "../hooks/modal";
import { styled } from "@linaria/react";

export default {
  name: "Modal",
  component: Modal
};

export const Basic = () => {
  const modal = useModal(true);

  return (
    <ArweaveWalletKit>
      <Modal {...modal.bindings}>
        <Head onClose={modal.bindings.onClose}>
          <Title>Connect wallet</Title>
        </Head>
        <Apps>
          <Application
            name="ArConnect"
            description="Secure wallet management for Arweave"
            logo="https://lh3.googleusercontent.com/fife/AAbDypARM46G9BG8Y387jm9xoFSIXs6_yqC2wS2JukihPte0-V7KNVRk3XULiv-wXf39o6pdcGpAB575lJRZzmcjswpPpo06oMEJsYjzhhTRYUEUO1j3DbLpCRxC3GqXxBCweww3dj7FaVLUIuOOaM8R4vRS4YXN1dcn3-f1wJgU0Z1rAlHu1P-TeTE2IPKOBMHadg1N1x_QET3Q10_FxH99dXS6X5lGAy9sQpj_sbGN-AqAUbvbZzd_QgNThyoGm5Fe0tl_q5WGthRFIKtHlP4qHRqF0zQ3D1o04gi_vYwM9ktHFcUO9a1SkRpMsVtqfmxKR6tU-zcDeXyakdk7SE64RQzy6yzejAcznN_HweINX1ZFvZhq9wBL6fCmlZNcnf7WvdKfFMZEBaLngFaisJwS9AzA3Z9IAE5ZKjgWof-_tXbtQFstAFXz9maoBT2oXWp0oX8gdC6sUGUUhGHqbkqm5D0IkzMewutCOyrMEtfacFMxEkXpYRY1V7xjM07CMbo53GBYpaaHBQtNjvl17E8LmZJFPpQDKdhartq_LpuEi80OgJ4EUSn1lLW1FXGtj93hchy0p68tUseBf-jCKOEf44Rjr2aJD0XN3ZxKDkPR9egWEMy-M5E9mEFeI5CVyNHjJK90lHZLvmRkVgMftswMgzseMIsHTCpyvK-qHwx6aqvrJj58OxyJZPFBDcm9slRXbpdBHInfK_vs0N_j19mpo6T9AI3ibFmyrf04gEorGYZGnG2WMnPT51cvPeizPuGkNUH6CKop8UPlp3gXUmhdNphc72vtt7WFc4_UhRjts21RdHJ_LnNASuHBxLPFVgc29ysaBjAwilT0PoddIB9C8b613KIItfIjQQU71Kpj7HV0wr6nszQPtcQefqG9z1bDY46_AjOWx8sqDnTUnz-BWbNbJCPFiQ_5so6PblAzDlDrOT1ZFu8hRNZw358zkTIRUNjxwU7xA6HrG99fdjldtjZJZTHxXph5ZfY6TTUKeLG6uGhE0j4SMyD4DFwMAyiwJwQsXmtiicWtbZhu9Mw15U8nvQlEkOYTRh7CCN17xUtEFO3oCigJeQFgtn5HMmUbg4JI3NjLSwmZiMHLdBCG1wGDw8llzCOyULdiX6fYGW7NxIe6ci3wQulpfw0CeNz0-4ePelsv12UGZGZ_hEflYPWkxAcmH17mPhR_c4RObF990I0kfEyWCFZuNXEeZJLmkzUBoxZYtdJcsO0XT7ToqBRcWHws3Sk39xPQtwVhMs2nQJiVMzyGzliO321SAHDAn_WdXtQm19v56zkaHm-ZfY5tGrERCmsjKvoKHt01eRXD_lVf_rxQ0lhXjS9BTbX7A0skEpCWcyVcKh-XgbIGPpf_dHdDf5Kqb4_YH2fjg7vRZhrSzwE7CECtXIJeCT02GdqFNcI4FVJgW9y2_Vofyq_krW1ERImL3G-Dl4ynXJn_yBDzPZDUzQDyWcVa8ePSpKN8bDPzbCYaCNQEn3UZHXXPDNnH1ftDCj0F5N2occivJYqwaJdaiiJvUNLeS1Q1NW2dochMmYzRvlu8WcmKxru5xVCNUdYph0d8I6NhlgZf8Owy-9QB3qFwhaGsDu7EnA=w3024-h1562"
            theme="171, 154, 255"
          />
        </Apps>
        <Footer>
          <TitleWithParagraph>
            <Title small>New to Arweave?</Title>
            <Paragraph small>
              Click to learn more about the permaweb & wallets.
            </Paragraph>
          </TitleWithParagraph>
          <Button>MORE</Button>
        </Footer>
      </Modal>
    </ArweaveWalletKit>
  );
};

const Apps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;
`;
