import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
    render,
  } from "@react-email/components";

interface PrimaryActionEmailProps {
  actionLabel: string;
  buttonText: string;
  href: string;
}

export const EmailTemplate = ({ actionLabel, buttonText, href}: PrimaryActionEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>
            Fastest ecommerce store in your town!
            </Preview>
            <Body style={main}>
                <Container style={container}>
                <Img
                src="/logo.png"
                width='150'
                height='150'
                alt="FlashCommerce"
                style={logo}/>
                <Text style={paragraph}>Hi!</Text>
                <Text>Discover effortless shopping and lightning-fast 
                delivery with FlashCommerce. Use the button below {actionLabel}
                </Text>
                <Section style={btnContainer}>
                <Button style={button} href={href}>
                {buttonText}
                </Button>
                </Section>
                <Text style={paragraph}>
                Regards,
                <br />
                The FlashCommerce Team
                </Text>
                <Hr style={hr} />
                <Text style={footer}>
                If you did not initiate this email request, Please disregard it.
                </Text>
                </Container>
            </Body>
        </Html>
    )
}

export const PrimaryActionEmailHtml = (props: PrimaryActionEmailProps) => {
    const htmlString = renderToStaticMarkup(<EmailTemplate {...props} />);
    return htmlString;
};

const main = {
    backgroundColor: '#000000', // Black background
    fontFamily: 'Roboto, sans-serif',
};
  
const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
};
  
const logo = {
    margin: '0 auto',
};
  
const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#ffffff', // White text color
};
  
const btnContainer = {
    textAlign: 'center' as const,
};
  
const button = {
    padding: '12px 12px',
    backgroundColor: '#f59e0b', // Yellow-400 button background
    borderRadius: '3px',
    color: '#000000', // Black button text color
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
};
  
const hr = {
    borderColor: '#cccccc', // Light gray horizontal rule color
    margin: '20px 0',
};
  
const footer = {
    color: '#8898aa',
    fontSize: '12px',
};
  