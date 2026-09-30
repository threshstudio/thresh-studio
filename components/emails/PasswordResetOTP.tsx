import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components"
import * as React from "react"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://threshstudio.com"

interface PasswordResetOTPProps {
  otp: string
}

export const PasswordResetOTP = ({ otp }: PasswordResetOTPProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your password reset OTP code</Preview>
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
              Reset Your Password
            </Heading>
            <Text className="text-[14px] leading-[24px] text-[#F1F0F2]">
              Hello,
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#F1F0F2]">
              We received a request to reset the password for your Thresh Studio
              Admin account. Enter the following One-Time Password (OTP) to
              proceed:
            </Text>
            <Section className="mt-[32px] mb-[32px] rounded-md border border-solid border-brand-500 bg-[#403D45] py-[16px] text-center">
              <Text className="m-0 font-mono text-[32px] font-bold tracking-[8px] text-brand-200">
                {otp}
              </Text>
            </Section>
            <Text className="text-[14px] leading-[24px] text-[#F1F0F2]">
              This code will expire in 15 minutes.
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#F1F0F2]">
              If you didn&apos;t request a password reset, you can safely ignore
              this email.
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

PasswordResetOTP.PreviewProps = {
  otp: "123456",
} as PasswordResetOTPProps

export default PasswordResetOTP
