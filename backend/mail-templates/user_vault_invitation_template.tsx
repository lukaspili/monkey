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

interface UserVaultInvitationTemplateProps {
  cdnUrl: string;
  invitedBy: string;
  name: string;
  inviteUrl: string;
}

export const UserVaultInvitationTemplate = ({
  cdnUrl,
  invitedBy,
  name,
  inviteUrl,
}: UserVaultInvitationTemplateProps) => (
  <Html>
    <Head />
    <Preview>{invitedBy} has invited you to join their vault.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img src={`${cdnUrl}/logo.png`} width="80" height="80" alt="" />
        </Section>
        <Heading style={h1}>Join {invitedBy}'s vault</Heading>
        <Text style={heroText}>Hi {name},</Text>
        <Text style={heroText}>
          {invitedBy} has invited you to join their vault on Monkey. Click the link below to respond
          to the invitation.
        </Text>

        <Button href={inviteUrl} style={{ ...button, marginTop: "30px", marginBottom: "30px" }}>
          Respond to invitation
        </Button>

        <Text
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            marginBottom: "30px",
          }}
        >
          Alternatively, you can copy and paste the following link into your browser: <br />
          <Link href={inviteUrl}>{inviteUrl}</Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

UserVaultInvitationTemplate.PreviewProps = {
  cdnUrl: `/static`,
  name: "John",
  invitedBy: "Alice",
  inviteUrl: "https://google.com",
} as UserVaultInvitationTemplateProps;

export default UserVaultInvitationTemplate;

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
