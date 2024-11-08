import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerifyEmailTemplateProps {
  cdnUrl: string;
  code: string;
}

export const VerifyEmailTemplate = ({ code, cdnUrl }: VerifyEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Confirm your email address</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img src={`${cdnUrl}/logo.png`} width="80" height="80" alt="" />
        </Section>
        <Heading style={h1}>Confirm your email address</Heading>
        <Text style={heroText}>
          Your confirmation code is below - enter it in your open browser window and we'll help you
          get signed in.
        </Text>

        <Section style={codeBox}>
          <Text style={confirmationCodeText}>{code}</Text>
        </Section>

        <Text style={text}>
          If you didn't request this email, there's nothing to worry about, you can safely ignore
          it.
        </Text>
      </Container>
    </Body>
  </Html>
);

VerifyEmailTemplate.PreviewProps = {
  code: "DJZ-TLX",
  cdnUrl: `/static`,
} as VerifyEmailTemplateProps;

export default VerifyEmailTemplate;

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "0px 20px",
};

const logoContainer = {
  marginTop: "32px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "28px",
  fontWeight: "700",
  margin: "24px 0 20px 0",
  padding: "0",
  lineHeight: "36px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginBottom: "30px",
  padding: "40px 10px",
};

const confirmationCodeText = {
  fontSize: "30px",
  textAlign: "center" as const,
  verticalAlign: "middle",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
