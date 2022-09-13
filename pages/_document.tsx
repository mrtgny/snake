import Document, { DocumentContext, Head as NextHead, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return {
            ...initialProps,
        }
    }

    render() {
        const keywordsArray = [
            "Murat Güney",
            "Murat Guney",
            "mrtgny",
            "Snake",
            "Snake Game",
            "https://github.com/mrtgny",
            "https://muratguney.medium.com",
            "https://www.linkedin.com/in/murat-guney",
        ]

        const keywords = keywordsArray.join(", ")

        return (
            <Html lang="en">
                <NextHead>
                    <meta name="keywords" content={keywords} />
                </NextHead>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument