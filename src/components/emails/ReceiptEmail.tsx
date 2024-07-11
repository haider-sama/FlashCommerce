import { formatPrice } from "../../lib/utils";
import { Product } from "../../payload-types";
import * as React from "react";
import { format } from "date-fns";
import {
    Body,
    Container,
    Column,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    render,
} from "@react-email/components";

interface ReceiptEmailProps {
    email: string;
    date: Date;
    orderId: string;
    products: Product[];
}

export const ReceiptEmail = ({email, date, orderId, products}: ReceiptEmailProps) => {
    const total = products.reduce((acc, curr) => acc + curr.price, 0) + 1;

    return (
        <Html>
            <Head />
            <Preview>Your Order Receipt</Preview>

            <Body style={main}>
                <Container style={container}>
                    <Section>
                        <Column align="right" style={tableCell}>
                            <Text style={heading}>Order Receipt</Text>
                        </Column>
                    </Section>
                    <Section style={informationTable}>
                        <Row style={informationTableRow}>
                            <Column style={informationTableColumn}>
                                <Text style={informationTableLabel}>EMAIL</Text>
                                <Link style={{...informationTableValue}}>{email}</Link>
                            </Column>

                            <Column style={informationTableColumn}>
                                <Text style={informationTableLabel}>INVOICE DATE</Text>
                                <Text style={informationTableValue}>
                                {format(date, "dd MMM yyyy")}
                                </Text>
                            </Column>

                            <Column style={informationTableColumn}>
                                <Text style={informationTableLabel}>ORDER ID</Text>
                                <Link style={{...informationTableValue}}>
                                {orderId}
                                </Link>
                            </Column>
                        </Row>
                    </Section>

                    <Section style={productTitleTable}>
                        <Text style={productsTitle}>Order Summary</Text>
                    </Section>

                    {products.map((product) => {
                        const { image } = product.images[0];
                        return (
                            <Section key={product.id}>
                                <Column style={{ width: '64px' }}>
                                {typeof image !== "string" && image.url ? (
                                <Img src={image.url}
                                width="64" height="64"
                                alt={product.name}
                                style={productIcon}/>) : null}
                                </Column>
                                <Column style={{ paddingLeft: '22px' }}>
                                    <Text style={productTitle}>{product.name}</Text>
                                    {product.description && (
                                    <Text style={productDescription}>
                                    {product.description.length > 50
                                    ? `${product.description.slice(0, 50)}...`
                                    : product.description}
                                    </Text>
                                    )}
                                    <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderId}`}
                                    style={productLink}>
                                        Download Mod
                                    </Link>
                                </Column>

                                <Column style={productPriceWrapper} align="right">
                                    <Text style={productPrice}>
                                    {formatPrice(product.price)}
                                    </Text>
                                </Column>
                            </Section>
                        )
                    })}


                    <Section>
                        <Column style={{ width: '64px' }}></Column>
                        <Column style={{ paddingLeft: '40px', paddingTop: 20}}>
                            <Text style={productTitle}>Transaction Fee</Text>
                        </Column>

                        <Column style={productPriceWrapper} align="right">
                            <Text style={productPrice}>
                            {formatPrice(1)}
                            </Text>
                        </Column>
                    </Section>

                    <Hr style={productPriceLine} />
                    <Section align="right">
                        <Column style={tableCell} align="right">
                            <Text style={productPriceTotal}>TOTAL</Text>
                        </Column>
                        <Column style={productPriceVerticalLine}></Column>
                        <Column style={productPriceLargeWrapper}>
                            <Text style={productPriceLarge}>
                                {formatPrice(total)}
                            </Text>
                        </Column>
                    </Section>

                    <Hr style={productPriceLineBottom} />

                    <Text style={footerCopyright}>
                        Copyright © {new Date().getFullYear()} FlashCommerce. <br />{' '}
                        <Link href='#'>All rights reserved.</Link>
                    </Text>

                </Container>
            </Body>
        </Html>
    )
}


export const ReceiptEmailHtml = (props: ReceiptEmailProps) =>
    render(<ReceiptEmail {...props} />, {
      pretty: true,
});


const main = {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    backgroundColor: '#FFFBCC', // light yellow background
    color: '#000000', // black text
};
  
const resetText = {
    margin: '0',
    padding: '0',
    lineHeight: 1.4,
    color: '#000000', // black text
};
  
const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '660px',
};
  
const tableCell = {
    display: 'table-cell',
    color: '#000000', // black text
};
  
const heading = {
    fontSize: '28px',
    fontWeight: '300',
    color: '#000000', // black text
};
  
const informationTable = {
    borderCollapse: 'collapse' as const,
    borderSpacing: '0px',
    color: '#333333',
    backgroundColor: '#FFF8DC', // light yellow
    borderRadius: '3px',
    fontSize: '12px',
    marginTop: '12px',
};
  
const informationTableRow = {
    height: '46px',
};
  
const informationTableColumn = {
    paddingLeft: '20px',
    borderStyle: 'solid',
    borderColor: '#FFF8DC',
    borderWidth: '0px 1px 1px 0px',
    height: '44px',
};
  
const informationTableLabel = {
    ...resetText,
    color: '#666666',
    fontSize: '10px',
};
  
const informationTableValue = {
    fontSize: '12px',
    margin: '0',
    padding: '0',
    lineHeight: 1.4,
    color: '#000000', // black text
};
  
const productTitleTable = {
    ...informationTable,
    margin: '30px 0 15px 0',
    height: '24px',
};
  
const productsTitle = {
    background: '#FFF8DC',
    paddingLeft: '10px',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0',
    color: '#000000', // black text
};
  
const productIcon = {
    margin: '0 0 0 20px',
    borderRadius: '14px',
    border: '1px solid rgba(128, 128, 128, 0.2)',
};
  
const productTitle = {
    fontSize: '12px',
    fontWeight: '600',
    ...resetText,
};
  

const productDescription = {
    fontSize: '12px',
    ...resetText,
};
  
const productLink = {
    fontSize: '12px',
    color: '#FFD700', // yellow-400 equivalent
    textDecoration: 'none',
};
  
const productPriceTotal = {
    margin: '0',
    color: '#666666',
    fontSize: '10px',
    fontWeight: '600',
    padding: '0px 30px 0px 0px',
    textAlign: 'right' as const,
};
  
const productPrice = {
    fontSize: '12px',
    fontWeight: '600',
    margin: '0',
    color: '#000000', // black text
};
  
const productPriceLarge = {
    margin: '0px 20px 0px 0px',
    fontSize: '16px',
    fontWeight: '600',
    whiteSpace: 'nowrap' as const,
    textAlign: 'right' as const,
    color: '#000000', // black text
};
  
const productPriceWrapper = {
    display: 'table-cell',
    padding: '0px 20px 0px 0px',
    width: '100px',
    verticalAlign: 'top',
};
  
const productPriceLine = {
    margin: '30px 0 0 0',
};
  
const productPriceVerticalLine = {
    height: '48px',
    borderLeft: '1px solid',
    borderColor: '#EEEEEE',
};
  
const productPriceLargeWrapper = {
    display: 'table-cell',
    width: '90px',
};
  
const productPriceLineBottom = {
    margin: '0 0 75px 0',
};
  
const footerLinksWrapper = {
    margin: '8px 0 0 0',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#666666',
};
  
const footerCopyright = {
    margin: '25px 0 0 0',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#666666',
};