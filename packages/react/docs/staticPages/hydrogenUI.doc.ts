import { LandingTemplateSchema } from '@shopify/generate-docs'

const data: LandingTemplateSchema = {
    title: 'Hydrogen UI',
    description: 'A set of components surfaced from hydrogen',
    image: '',
    darkImage: '',
    id: 'hydrogen-ui',
    sections: [{
        type: "Libraries",
        anchorLink: "setup",
        sectionContent: "Content for hydrogen-ui setup.",
        title: "Setup",
        codeSamples: [{
            tabs: [{
                title: "hydrogen-ui setup",
                code: "yarn add @shopify/hydrogen-react"
            }],
        }],
        codeLanguages: ["typescript"],
        accordionContent: {
            typescript: {
                label: "typescript",
                content: "use typescript its the best",
                icon: "typescript"
            },
        },
        initialCodeLanguage: "typescript",
    },
    {
        type: "Generic",
        anchorLink: "section-two",
        title: "Section two",
        sectionContent: "another section",
        codeblock: {
            tabs: [{
                title: "generic section",
                code: "I am code!"
            }]
        },
        initialLanguage: "typescript",
    }, {
        type: "Resource",
        anchorLink: "resources",
        title: "Related Resources",
        resources: [{
            name: "Hydrogen",
            url: "/api/hydrogen"
        }]
    }
    ]
}

export default data;