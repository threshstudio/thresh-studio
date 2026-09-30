import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components"
import * as React from "react"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://threshstudio.com"

interface EmailChangeVerificationProps {
  verificationLink: string
  newEmail: string
}

export const EmailChangeVerification = ({
  verificationLink,
  newEmail,
}: EmailChangeVerificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your new email address for Thresh Studio Admin</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: { 200: "#00D3DA", 500: "#005A5D" },
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-[#050505] px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-lg border border-solid border-[#403D45] bg-[#201F24] p-[20px] shadow-sm">
            <Img
              src={`${baseUrl}/logo.png`}
              width="120"
              height="auto"
              alt="Thresh Studio"
              className="mx-auto mt-[20px] mb-[20px]"
            />
            <Heading className="mx-0 my-[10px] p-0 text-center text-[24px] font-bold text-white">
              Verify Email Address
            </Heading>
            <Text className="text-[14px] leading-[24px] text-[#F1F0F2]">
              Hello,
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#F1F0F2]">
              We received a request to change the email address for your Thresh
              Studio Admin account to{" "}
              <strong className="text-white">{newEmail}</strong>.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Link
                href={verificationLink}
                className="inline-block rounded-md bg-brand-200 px-6 py-3 text-center text-[14px] font-bold tracking-wider text-[#001617] uppercase no-underline"
              >
                Verify New Email
              </Link>
            </Section>
            <Text className="text-[14px] leading-[24px] text-[#F1F0F2]">
              If you didn&apos;t request this change, you can safely ignore this
              email and your email address will remain unchanged.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#403D45]" />
            <Text className="text-center text-[12px] leading-[24px] tracking-widest text-[#AAA8AF] uppercase">
              Thresh Studio Admin
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

EmailChangeVerification.PreviewProps = {
  verificationLink: "https://threshstudio.com/admin/verify-email?token=preview",
  newEmail: "new.admin@threshstudio.com",
} as EmailChangeVerificationProps

export default EmailChangeVerification
