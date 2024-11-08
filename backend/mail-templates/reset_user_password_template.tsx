import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ResetUserPasswordTemplateProps {
  cdnUrl: string;
  name: string;
  resetUrl: string;
}

export const ResetUserPasswordTemplate = ({
  cdnUrl,
  name,
  resetUrl,
}: ResetUserPasswordTemplateProps) => (
  <Html>
    <Head />
    <Preview>We received a request to reset your password.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img src={`${cdnUrl}/logo.png`} width="80" height="80" alt="" />
        </Section>
        <Heading style={h1}>Reset your password</Heading>
        <Text style={heroText}>Hi {name},</Text>
        <Text style={heroText}>
          We received a request to reset your password. Click the link below to proceed.
        </Text>

        <Button href={resetUrl} style={{ ...button, marginTop: "30px", marginBottom: "30px" }}>
          Reset password
        </Button>

        <Text
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            marginBottom: "30px",
          }}
        >
          Alternatively, you can copy and paste the following link into your browser: <br />
          <Link href={resetUrl}>{resetUrl}</Link>
        </Text>

        <Text style={text}>
          If you didn't request this email, there's nothing to worry about, you can safely ignore
          it.
        </Text>
      </Container>
    </Body>
  </Html>
);

ResetUserPasswordTemplate.PreviewProps = {
  cdnUrl: `/static`,
  name: "John Doe",
  resetUrl: "https://google.com",
} as ResetUserPasswordTemplateProps;

export default ResetUserPasswordTemplate;

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
};

const button = {
  backgroundColor: "#09090b",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
