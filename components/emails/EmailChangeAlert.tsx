import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Text,
  Tailwind,
} from "@react-email/components"
import * as React from "react"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://threshstudio.com"

interface EmailChangeAlertProps {
  oldEmail: string
  newEmail: string
  date: Date
}

export const EmailChangeAlert = ({
  oldEmail,
  newEmail,
  date,
}: EmailChangeAlertProps) => {
  return (
    <Html>
      <Head />
      <Preview>Security Alert: Email change requested</Preview>
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
              Security Alert
            </Heading>
            <Text className="text-[14px] leading-[24px] text-[#F1F0F2]">
              Hello,
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#F1F0F2]">
              We noticed a request to change the email address for your Thresh
              Studio Admin account (
              <strong className="text-white">{oldEmail}</strong>) to{" "}
              <strong className="text-white">{newEmail}</strong>.
            </Text>
            <Text className="text-[14px] leading-[24px] text-[#F1F0F2]">
              This request was made on{" "}
              <strong className="text-white">
                {date.toLocaleDateString()}
              </strong>{" "}
              at{" "}
              <strong className="text-white">
                {date.toLocaleTimeString()}
              </strong>
              .
            </Text>
            <Text className="mt-[16px] text-[14px] leading-[24px] font-semibold text-[#F1F0F2] text-red-500">
              If you did not make this request, please contact support
              immediately or secure your account by resetting your password.
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

EmailChangeAlert.PreviewProps = {
  oldEmail: "admin@threshstudio.com",
  newEmail: "new.admin@threshstudio.com",
  date: new Date(),
} as EmailChangeAlertProps

export default EmailChangeAlert
