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

interface WelcomeSubscriberEmailProps {
  unsubscribeUrl?: string
}

export const WelcomeSubscriberEmail = ({
  unsubscribeUrl = `${baseUrl}/unsubscribe`,
}: WelcomeSubscriberEmailProps) => {
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: { 200: "#00D3DA", 400: "#009DA3", 500: "#005A5D" },
              },
            },
          },
        }}
      >
        <Head />
        <Preview>
          Welcome to Thresh Studio — You&apos;re now on the list
        </Preview>
        <Body className="mx-auto my-auto bg-[#070709] px-2 font-sans text-neutral-100">
          <Container className="mx-auto my-[40px] max-w-[560px] overflow-hidden rounded-2xl border border-solid border-[#26252B] bg-[#121115] shadow-2xl">
            {/* Header */}
            <Section className="border-b border-solid border-[#26252B] bg-[#0E0D11] px-[32px] py-[28px] text-center">
              <Link href={baseUrl} className="inline-block">
                <Img
                  src={`${baseUrl}/logo.png`}
                  width="140"
                  height="auto"
                  alt="Thresh Studio"
                  className="mx-auto block"
                />
              </Link>
            </Section>

            {/* Content */}
            <Section className="px-[32px] py-[36px]">
              <Text className="font-mono text-[12px] font-bold tracking-[0.25em] text-[#00D3DA] uppercase">
                Welcome to the Circle
              </Text>

              <Heading className="my-[12px] text-[24px] leading-tight font-bold text-white">
                You&apos;re now connected to Thresh Studio.
              </Heading>

              <Text className="text-[15px] leading-[26px] text-[#D4D3D8]">
                Thank you for subscribing. We share occasional, high-caliber
                insights into cinematic brand films, 3D product launches, and
                digital creative direction. No noise, just craft.
              </Text>

              <Section className="mt-[28px] mb-[28px]">
                <Link
                  href={`${baseUrl}/work`}
                  className="inline-block rounded-full bg-[#00D3DA] px-[28px] py-[14px] text-center font-mono text-[12px] font-bold tracking-[0.2em] text-[#070709] uppercase no-underline shadow-lg"
                >
                  Explore Recent Work →
                </Link>
              </Section>

              <Text className="text-[14px] leading-[24px] text-[#A2A1A8]">
                Have a project or partnership in mind? You can reply directly to
                this email or{" "}
                <Link
                  href="https://calendly.com/threshstudioz/30min"
                  className="text-[#00D3DA] underline"
                >
                  book a strategy call
                </Link>
                .
              </Text>
            </Section>

            {/* Divider */}
            <Hr className="mx-0 my-0 w-full border border-solid border-[#26252B]" />

            {/* Footer */}
            <Section className="bg-[#0A090D] px-[32px] py-[24px] text-center">
              <Text className="m-0 mb-[8px] font-mono text-[11px] font-bold tracking-[0.2em] text-[#00D3DA] uppercase">
                THRESH STUDIO
              </Text>
              <Text className="m-0 mb-[14px] text-[11px] leading-[18px] text-[#6B6A71]">
                Product Branding & Cinematic Marketing
              </Text>

              <Link
                href={unsubscribeUrl}
                className="inline-block text-[11px] text-[#8E8D94] underline"
              >
                Unsubscribe
              </Link>

              <Text className="mt-[16px] mb-0 text-[10px] tracking-wider text-[#504F56] uppercase">
                © {new Date().getFullYear()} Thresh Studio LLC. All rights
                reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default WelcomeSubscriberEmail
