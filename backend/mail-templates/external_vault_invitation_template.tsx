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

interface ExternalVaultInvitationTemplateProps {
  cdnUrl: string;
  invitedBy: string;
  email: string;
  inviteUrl: string;
}

export const ExternalVaultInvitationTemplate = ({
  cdnUrl,
  invitedBy,
  email,
  inviteUrl,
}: ExternalVaultInvitationTemplateProps) => (
  <Html>
    <Head />
    <Preview>You've been invited by {invitedBy} to join their vault on Monkey.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img src={`${cdnUrl}/logo.png`} width="80" height="80" alt="" />
        </Section>
        <Heading style={h1}>Join {invitedBy}'s vault</Heading>
        <Text style={heroText}>Hi there,</Text>
        <Text style={heroText}>
          {invitedBy} has invited you to join their vault on Monkey. Click the link below to
          proceed.
        </Text>

        <Button href={inviteUrl} style={{ ...button, marginTop: "30px", marginBottom: "30px" }}>
          Respond to invitation
        </Button>

        <Text
          style={{
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          Alternatively, you can copy and paste the following link into your browser: <br />
          <Link href={inviteUrl}>{inviteUrl}</Link>
        </Text>

        <Text style={text}>
          Joining the vault requires creating an account using the email address you were invited
          on: <strong>{email}</strong>. It's free. No strings attached.
        </Text>

        <Text style={text}>
          If you're not interested to join {invitedBy}'s vault, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

ExternalVaultInvitationTemplate.PreviewProps = {
  cdnUrl: `/static`,
  invitedBy: "John",
  email: "john@doe.com",
  inviteUrl: "https://google.com",
} as ExternalVaultInvitationTemplateProps;

export default ExternalVaultInvitationTemplate;

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
