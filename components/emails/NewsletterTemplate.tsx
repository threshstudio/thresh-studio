import {
  Body,
  Container,
  Head,
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

interface NewsletterTemplateProps {
  subject: string
  previewText?: string
  contentHtml: string
  unsubscribeUrl?: string
}

export const NewsletterTemplate = ({
  subject,
  previewText = "Latest updates from Thresh Studio",
  contentHtml,
  unsubscribeUrl = `${baseUrl}/unsubscribe`,
}: NewsletterTemplateProps) => {
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
        <Head>
          <style>{`
            .email-content h1 { font-size: 26px; font-weight: 700; color: #FFFFFF; margin: 24px 0 12px; line-height: 1.25; }
            .email-content h2 { font-size: 20px; font-weight: 700; color: #FFFFFF; margin: 20px 0 10px; line-height: 1.3; }
            .email-content h3 { font-size: 16px; font-weight: 600; color: #00D3DA; margin: 16px 0 8px; line-height: 1.35; }
            .email-content p { font-size: 15px; line-height: 26px; color: #E5E5E5; margin: 12px 0; }
            .email-content a { color: #00D3DA; text-decoration: underline; font-weight: 500; }
            .email-content ul, .email-content ol { color: #E5E5E5; padding-left: 24px; margin: 12px 0; font-size: 15px; line-height: 26px; }
            .email-content li { margin-bottom: 6px; }
            .email-content blockquote { border-left: 3px solid #00D3DA; padding-left: 16px; margin: 16px 0; color: #B3B3B3; font-style: italic; }
            .email-content img { max-width: 100% !important; height: auto !important; border-radius: 12px; margin: 18px 0; display: block; border: 1px solid #333333; }
            .email-content hr { border: none; border-top: 1px solid #2B2A30; margin: 24px 0; }
          `}</style>
        </Head>
        <Preview>{previewText || subject}</Preview>
        <Body className="mx-auto my-auto bg-[#070709] px-2 font-sans text-neutral-100">
          <Container className="mx-auto my-[40px] max-w-[620px] overflow-hidden rounded-2xl border border-solid border-[#26252B] bg-[#121115] shadow-2xl">
            {/* Header with Brand Logo */}
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

            {/* Main Content Body */}
            <Section className="px-[32px] py-[32px]">
              <div
                className="email-content"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </Section>

            {/* Divider */}
            <Hr className="mx-0 my-0 w-full border border-solid border-[#26252B]" />

            {/* Branded Footer */}
            <Section className="bg-[#0A090D] px-[32px] py-[28px] text-center">
              <Text className="m-0 mb-[6px] font-mono text-[11px] font-bold tracking-[0.25em] text-[#00D3DA] uppercase">
                THRESH STUDIO
              </Text>
              <Text className="m-0 mb-[16px] text-[12px] text-[#8E8D94]">
                Product Branding & Cinematic Marketing
              </Text>

              <Text className="m-0 mb-[12px] text-[11px] leading-[18px] text-[#6B6A71]">
                You are receiving this update because you subscribed to Thresh
                Studio.
              </Text>

              <Section className="text-center">
                <Link
                  href={unsubscribeUrl}
                  className="inline-block text-[11px] text-[#8E8D94] underline"
                >
                  Unsubscribe from this newsletter
                </Link>
              </Section>

              <Text className="mt-[20px] mb-0 text-[10px] tracking-wider text-[#504F56] uppercase">
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

export default NewsletterTemplate
