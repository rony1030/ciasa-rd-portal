/**
 * FAQ Data — Bolsa Inmobiliaria
 * Preguntas frecuentes organizadas por categoría
 */
var FAQ_DATA = {
    categories: [
        { id: "inversion", label: "Inversión General", label_en: "Investment", label_fr: "Investissement", icon: "trending-up" },
        { id: "financiamiento", label: "Financiamiento", label_en: "Financing", label_fr: "Financement", icon: "coins" },
        { id: "confotur", label: "CONFOTUR", label_en: "CONFOTUR", label_fr: "CONFOTUR", icon: "landmark" },
        { id: "proceso", label: "Proceso de Compra", label_en: "Buying Process", label_fr: "Processus d'achat", icon: "file-text" },
        { id: "diaspora", label: "Desde el Exterior", label_en: "From Abroad", label_fr: "Depuis l'étranger", icon: "plane" },
        { id: "legal", label: "Legal", label_en: "Legal", label_fr: "Juridique", icon: "scale" }
    ],
    items: [
        // ── Inversión General ──────────────────────────────────
        {
            id: "faq-001",
            category: "inversion",
            question: "¿Por qué invertir en bienes raíces en República Dominicana?",
            answer: "República Dominicana es el destino turístico más visitado del Caribe, con un crecimiento económico sostenido de más del 5% anual. El sector inmobiliario ofrece retornos atractivos gracias a la demanda turística, incentivos fiscales como CONFOTUR y una legislación que protege la inversión extranjera. Además, los precios siguen siendo competitivos comparados con otros mercados del Caribe.",
            question_en: "Why invest in real estate in the Dominican Republic?",
            answer_en: "The Dominican Republic is the most visited tourist destination in the Caribbean, with sustained economic growth of over 5% per year. The real estate sector offers attractive returns driven by tourism demand, tax incentives like CONFOTUR, and legislation that protects foreign investment. Prices also remain competitive compared to other Caribbean markets.",
            question_fr: "Pourquoi investir dans l'immobilier en République dominicaine ?",
            answer_fr: "La République dominicaine est la destination touristique la plus visitée des Caraïbes, avec une croissance économique soutenue de plus de 5 % par an. Le secteur immobilier offre des rendements attrayants grâce à la demande touristique, des incitations fiscales comme CONFOTUR et une législation qui protège l'investissement étranger. De plus, les prix restent compétitifs par rapport aux autres marchés caribéens."
        },
        {
            id: "faq-002",
            category: "inversion",
            question: "¿Cuál es la inversión mínima para comenzar?",
            answer: "En nuestro catálogo encontrarás proyectos desde aproximadamente $97,000 USD. El monto de reserva inicial varía por proyecto, pero generalmente puedes separar una unidad con tan solo $1,000 a $5,000 USD. Durante la fase de construcción, muchos proyectos ofrecen planes de pago sin intereses.",
            question_en: "What is the minimum investment to get started?",
            answer_en: "Our catalog features projects starting at approximately $97,000 USD. The initial reservation amount varies by project, but you can typically reserve a unit with as little as $1,000 to $5,000 USD. During the construction phase, many projects offer interest-free payment plans.",
            question_fr: "Quel est l'investissement minimum pour commencer ?",
            answer_fr: "Notre catalogue propose des projets à partir d'environ 97 000 USD. Le montant de la réservation initiale varie selon le projet, mais vous pouvez généralement réserver une unité avec seulement 1 000 à 5 000 USD. Pendant la phase de construction, de nombreux projets offrent des plans de paiement sans intérêts."
        },
        {
            id: "faq-003",
            category: "inversion",
            question: "¿Qué retorno de inversión (ROI) puedo esperar?",
            answer: "Los retornos varían según la ubicación, tipo de propiedad y estrategia de inversión. Proyectos en zonas turísticas como Punta Cana y Bayahibe pueden generar entre un 8% y un 21% de retorno anual a través de rentas vacacionales en plataformas como Airbnb. La plusvalía del inmueble también contribuye al retorno total de la inversión.",
            question_en: "What return on investment (ROI) can I expect?",
            answer_en: "Returns vary depending on location, property type, and investment strategy. Projects in tourist areas like Punta Cana and Bayahibe can generate between 8% and 21% annual returns through vacation rentals on platforms like Airbnb. Property appreciation also contributes to the overall return on investment.",
            question_fr: "Quel retour sur investissement (ROI) puis-je espérer ?",
            answer_fr: "Les rendements varient selon l'emplacement, le type de propriété et la stratégie d'investissement. Les projets situés dans des zones touristiques comme Punta Cana et Bayahibe peuvent générer entre 8 % et 21 % de rendement annuel grâce à la location saisonnière sur des plateformes comme Airbnb. La plus-value immobilière contribue également au rendement global de l'investissement."
        },
        {
            id: "faq-004",
            category: "inversion",
            question: "¿Cuáles son los riesgos de invertir en propiedades en RD?",
            answer: "Como toda inversión, existen riesgos que debes considerar: retrasos en la construcción, fluctuaciones en la ocupación turística y cambios regulatorios. Para mitigar estos riesgos, todos nuestros proyectos son de constructoras verificadas, muchos operan con fideicomiso bancario y te acompañamos con asesoría legal durante todo el proceso.",
            question_en: "What are the risks of investing in Dominican Republic properties?",
            answer_en: "Like any investment, there are risks to consider: construction delays, fluctuations in tourist occupancy, and regulatory changes. To mitigate these risks, all our projects come from verified developers, many operate through bank-managed trust funds, and we provide legal guidance throughout the entire process.",
            question_fr: "Quels sont les risques d'investir dans l'immobilier en RD ?",
            answer_fr: "Comme tout investissement, il existe des risques à prendre en compte : retards de construction, fluctuations du taux d'occupation touristique et changements réglementaires. Pour atténuer ces risques, tous nos projets proviennent de promoteurs vérifiés, beaucoup fonctionnent avec un fidéicommis bancaire, et nous vous accompagnons avec des conseils juridiques tout au long du processus."
        },
        {
            id: "faq-005",
            category: "inversion",
            question: "¿Qué tipo de propiedad es mejor para inversión?",
            answer: "Depende de tu objetivo. Los apartamentos tipo estudio y de una habitación en zonas turísticas son ideales para renta vacacional en Airbnb. Las villas y condominios de 2-3 habitaciones atraen a familias y generan rentas más altas por noche. Los proyectos en preventa ofrecen mejores precios y mayor plusvalía al completarse la construcción.",
            question_en: "What type of property is best for investment?",
            answer_en: "It depends on your goal. Studio and one-bedroom apartments in tourist areas are ideal for vacation rentals on Airbnb. Villas and 2-3 bedroom condos attract families and command higher nightly rates. Pre-sale projects offer better prices and greater appreciation once construction is completed.",
            question_fr: "Quel type de propriété est le meilleur pour investir ?",
            answer_fr: "Cela dépend de votre objectif. Les studios et appartements d'une chambre dans les zones touristiques sont idéaux pour la location saisonnière sur Airbnb. Les villas et condominiums de 2-3 chambres attirent les familles et génèrent des loyers plus élevés par nuit. Les projets en prévente offrent de meilleurs prix et une plus-value supérieure à la livraison."
        },
        {
            id: "faq-006",
            category: "inversion",
            question: "¿Es mejor comprar en preventa o una propiedad terminada?",
            answer: "Ambas opciones tienen ventajas. En preventa obtienes precios más bajos (hasta un 20-30% menos), planes de pago durante construcción y mayor plusvalía al entregar. Las propiedades terminadas te permiten generar ingresos de inmediato y verificar la calidad antes de comprar. Tu elección dependerá de tu horizonte de inversión y necesidad de liquidez.",
            question_en: "Is it better to buy pre-sale or a completed property?",
            answer_en: "Both options have advantages. Pre-sale offers lower prices (up to 20-30% less), payment plans during construction, and greater appreciation upon delivery. Completed properties let you generate income immediately and verify quality before purchasing. Your choice will depend on your investment timeline and liquidity needs.",
            question_fr: "Vaut-il mieux acheter en prévente ou un bien achevé ?",
            answer_fr: "Les deux options ont leurs avantages. En prévente, vous bénéficiez de prix plus bas (jusqu'à 20-30 % de moins), de plans de paiement pendant la construction et d'une plus-value supérieure à la livraison. Les propriétés achevées vous permettent de générer des revenus immédiatement et de vérifier la qualité avant d'acheter. Votre choix dépendra de votre horizon d'investissement et de vos besoins de liquidité."
        },

        // ── Financiamiento ─────────────────────────────────────
        {
            id: "faq-007",
            category: "financiamiento",
            question: "¿Qué opciones de financiamiento existen para dominicanos en el exterior?",
            answer: "Existen varias opciones: financiamiento directo con la constructora durante la fase de construcción (generalmente sin intereses), hipotecas bancarias a través de BanReservas Internacional para dominicanos en el exterior, y algunos proyectos ofrecen financiamiento interno a plazos de 5 a 10 años. Cada proyecto tiene condiciones específicas que te detallamos al consultar.",
            question_en: "What financing options are available for Dominicans living abroad?",
            answer_en: "There are several options: direct financing with the developer during the construction phase (usually interest-free), bank mortgages through BanReservas International for overseas Dominicans, and some projects offer in-house financing over 5 to 10 years. Each project has specific terms that we detail when you inquire.",
            question_fr: "Quelles options de financement existent pour les Dominicains vivant à l'étranger ?",
            answer_fr: "Plusieurs options s'offrent à vous : le financement direct avec le promoteur pendant la phase de construction (généralement sans intérêts), les prêts hypothécaires via BanReservas International pour les Dominicains à l'étranger, et certains projets proposent un financement interne sur 5 à 10 ans. Chaque projet a des conditions spécifiques que nous vous détaillons lors de votre demande."
        },
        {
            id: "faq-008",
            category: "financiamiento",
            question: "¿Cuánto debo dar de inicial (down payment)?",
            answer: "El inicial típico varía entre un 10% y un 30% del precio de la propiedad, dependiendo del proyecto y la constructora. En proyectos en preventa, el inicial se puede fraccionar en cuotas mensuales durante la construcción. Al solicitar financiamiento bancario, los bancos generalmente requieren entre un 20% y un 30% de inicial.",
            question_en: "How much do I need for a down payment?",
            answer_en: "The typical down payment ranges from 10% to 30% of the property price, depending on the project and developer. For pre-sale projects, the down payment can be split into monthly installments during construction. When applying for bank financing, banks generally require between 20% and 30% down.",
            question_fr: "Quel est le montant de l'apport initial requis ?",
            answer_fr: "L'apport initial typique varie entre 10 % et 30 % du prix de la propriété, selon le projet et le promoteur. Pour les projets en prévente, l'apport peut être fractionné en mensualités pendant la construction. Pour un financement bancaire, les banques exigent généralement entre 20 % et 30 % d'apport."
        },
        {
            id: "faq-009",
            category: "financiamiento",
            question: "¿Puedo pagar con remesas o transferencias internacionales?",
            answer: "Sí, la mayoría de las constructoras aceptan pagos mediante transferencia bancaria internacional directa a la cuenta del proyecto o fideicomiso. También puedes utilizar servicios de remesas como Western Union o Remitly para cuotas mensuales. Es importante conservar los recibos de todas las transferencias para el proceso legal de cierre.",
            question_en: "Can I pay with remittances or international wire transfers?",
            answer_en: "Yes, most developers accept payments via international bank wire transfer directly to the project or trust account. You can also use remittance services like Western Union or Remitly for monthly installments. It is important to keep receipts of all transfers for the legal closing process.",
            question_fr: "Puis-je payer par transferts de fonds ou virements internationaux ?",
            answer_fr: "Oui, la plupart des promoteurs acceptent les paiements par virement bancaire international directement sur le compte du projet ou du fidéicommis. Vous pouvez également utiliser des services de transfert comme Western Union ou Remitly pour les mensualités. Il est important de conserver les reçus de tous les transferts pour le processus juridique de clôture."
        },
        {
            id: "faq-010",
            category: "financiamiento",
            question: "¿BanReservas ofrece hipotecas para dominicanos en el exterior?",
            answer: "Sí, BanReservas Internacional tiene productos de crédito hipotecario diseñados específicamente para dominicanos residentes en Estados Unidos y Europa. Las tasas y condiciones varían, pero generalmente ofrecen plazos de hasta 20 años. Necesitarás demostrar ingresos estables, historial crediticio y cumplir con los requisitos de documentación del banco.",
            question_en: "Does BanReservas offer mortgages for Dominicans living abroad?",
            answer_en: "Yes, BanReservas International has mortgage products designed specifically for Dominicans residing in the United States and Europe. Rates and terms vary, but they generally offer terms of up to 20 years. You will need to demonstrate stable income, credit history, and meet the bank's documentation requirements.",
            question_fr: "BanReservas propose-t-elle des prêts hypothécaires pour les Dominicains résidant à l'étranger ?",
            answer_fr: "Oui, BanReservas International propose des produits hypothécaires conçus spécifiquement pour les Dominicains résidant aux États-Unis et en Europe. Les taux et conditions varient, mais ils offrent généralement des durées allant jusqu'à 20 ans. Vous devrez justifier de revenus stables, d'un historique de crédit et répondre aux exigences documentaires de la banque."
        },
        {
            id: "faq-011",
            category: "financiamiento",
            question: "¿Qué gastos adicionales debo considerar aparte del precio de la propiedad?",
            answer: "Los gastos adicionales típicos incluyen: impuesto de transferencia inmobiliaria (3% del valor catastral), gastos legales y notariales (1-2%), registro de propiedad, y gastos de cierre. Si la propiedad tiene CONFOTUR, el impuesto de transferencia se exonera. También debes presupuestar cuotas de mantenimiento mensuales si es un proyecto con áreas comunes.",
            question_en: "What additional costs should I budget for beyond the property price?",
            answer_en: "Typical additional costs include: real estate transfer tax (3% of assessed value), legal and notary fees (1-2%), property registration, and closing costs. If the property has CONFOTUR approval, the transfer tax is waived. You should also budget for monthly maintenance fees if the project has common areas.",
            question_fr: "Quels frais supplémentaires dois-je prévoir en plus du prix de la propriété ?",
            answer_fr: "Les frais supplémentaires typiques comprennent : la taxe de transfert immobilier (3 % de la valeur cadastrale), les frais juridiques et notariaux (1-2 %), l'enregistrement de la propriété et les frais de clôture. Si la propriété bénéficie de CONFOTUR, la taxe de transfert est exonérée. Vous devez également prévoir des charges de copropriété mensuelles si le projet comprend des espaces communs."
        },
        {
            id: "faq-012",
            category: "financiamiento",
            question: "¿Puedo usar un crédito hipotecario de EE.UU. para comprar en RD?",
            answer: "No directamente. Las hipotecas de bancos estadounidenses no aplican para propiedades en República Dominicana. Sin embargo, puedes utilizar el equity de una propiedad en EE.UU. a través de un home equity loan o HELOC para financiar tu compra en RD. Esta es una estrategia que muchos inversionistas dominicanos en el exterior utilizan con éxito.",
            question_en: "Can I use a U.S. mortgage to buy property in the DR?",
            answer_en: "Not directly. U.S. bank mortgages do not apply to properties in the Dominican Republic. However, you can leverage the equity in a U.S. property through a home equity loan or HELOC to fund your purchase in the DR. This is a strategy that many Dominican investors abroad use successfully.",
            question_fr: "Puis-je utiliser un prêt hypothécaire américain pour acheter en RD ?",
            answer_fr: "Pas directement. Les prêts hypothécaires des banques américaines ne s'appliquent pas aux propriétés en République dominicaine. Cependant, vous pouvez utiliser la valeur nette d'une propriété aux États-Unis via un prêt sur valeur domiciliaire (home equity loan) ou une marge de crédit hypothécaire (HELOC) pour financer votre achat en RD. C'est une stratégie que de nombreux investisseurs dominicains à l'étranger utilisent avec succès."
        },

        // ── CONFOTUR ───────────────────────────────────────────
        {
            id: "faq-013",
            category: "confotur",
            question: "¿Qué es CONFOTUR y cómo me beneficia?",
            answer: "CONFOTUR (Consejo de Fomento Turístico) es una ley de incentivo fiscal dominicana que exonera de impuestos a proyectos en zonas turísticas por un período de hasta 15 años. Como comprador, te beneficias con la exoneración del impuesto de transferencia inmobiliaria (3%), el Impuesto a la Propiedad Inmobiliaria (IPI) anual y el impuesto sobre ganancias de capital al vender.",
            question_en: "What is CONFOTUR and how does it benefit me?",
            answer_en: "CONFOTUR (Tourism Development Council) is a Dominican tax incentive law that grants tax exemptions to projects in tourist areas for up to 15 years. As a buyer, you benefit from exemption on the real estate transfer tax (3%), the annual Property Tax (IPI), and capital gains tax when you sell.",
            question_fr: "Qu'est-ce que CONFOTUR et quels sont les avantages ?",
            answer_fr: "CONFOTUR (Conseil de Développement Touristique) est une loi d'incitation fiscale dominicaine qui exonère d'impôts les projets situés dans des zones touristiques pour une durée pouvant aller jusqu'à 15 ans. En tant qu'acheteur, vous bénéficiez de l'exonération de la taxe de transfert immobilier (3 %), de l'impôt foncier annuel (IPI) et de l'impôt sur les plus-values lors de la revente."
        },
        {
            id: "faq-014",
            category: "confotur",
            question: "¿Todos los proyectos tienen CONFOTUR?",
            answer: "No todos. CONFOTUR se otorga a proyectos que cumplen con criterios específicos de desarrollo turístico y están ubicados en zonas designadas. En nuestro catálogo, los proyectos con CONFOTUR están claramente identificados con una etiqueta. Actualmente, la mayoría de nuestros proyectos en Punta Cana, Bayahibe y Miches cuentan con este beneficio.",
            question_en: "Do all projects have CONFOTUR approval?",
            answer_en: "Not all of them. CONFOTUR is granted to projects that meet specific tourism development criteria and are located in designated areas. In our catalog, CONFOTUR-approved projects are clearly identified with a label. Currently, most of our projects in Punta Cana, Bayahibe, and Miches have this benefit.",
            question_fr: "Tous les projets bénéficient-ils de CONFOTUR ?",
            answer_fr: "Non, pas tous. CONFOTUR est accordé aux projets qui répondent à des critères spécifiques de développement touristique et sont situés dans des zones désignées. Dans notre catalogue, les projets bénéficiant de CONFOTUR sont clairement identifiés par une étiquette. Actuellement, la plupart de nos projets à Punta Cana, Bayahibe et Miches en bénéficient."
        },
        {
            id: "faq-015",
            category: "confotur",
            question: "¿Cuánto dinero me ahorro con CONFOTUR?",
            answer: "El ahorro es significativo. En una propiedad de $200,000 USD, te ahorras aproximadamente $6,000 en impuesto de transferencia al comprar, más el IPI anual (1% sobre el valor excedente de RD$9.86 millones) durante hasta 15 años. Además, al vender la propiedad dentro del período CONFOTUR, no pagas impuesto sobre la ganancia de capital (27%).",
            question_en: "How much money do I save with CONFOTUR?",
            answer_en: "The savings are significant. On a $200,000 USD property, you save approximately $6,000 on the transfer tax at purchase, plus the annual Property Tax (1% on the value exceeding RD$9.86 million) for up to 15 years. Additionally, when you sell the property within the CONFOTUR period, you pay no capital gains tax (27%).",
            question_fr: "Combien d'argent puis-je économiser avec CONFOTUR ?",
            answer_fr: "Les économies sont considérables. Pour une propriété de 200 000 USD, vous économisez environ 6 000 USD sur la taxe de transfert à l'achat, plus l'impôt foncier annuel (1 % sur la valeur excédant 9,86 millions RD$) pendant une durée pouvant aller jusqu'à 15 ans. De plus, en vendant le bien pendant la période CONFOTUR, vous ne payez aucun impôt sur les plus-values (27 %)."
        },
        {
            id: "faq-016",
            category: "confotur",
            question: "¿Cómo sé si un proyecto realmente tiene CONFOTUR aprobado?",
            answer: "El proyecto debe tener una resolución oficial del Consejo de Fomento Turístico. Puedes verificarlo solicitando el número de resolución CONFOTUR y confirmándolo en el portal del Ministerio de Turismo. Nuestro equipo verifica el estatus CONFOTUR de cada proyecto antes de incluirlo en el catálogo y te proporcionamos la documentación correspondiente.",
            question_en: "How do I know if a project truly has CONFOTUR approval?",
            answer_en: "The project must have an official resolution from the Tourism Development Council. You can verify it by requesting the CONFOTUR resolution number and confirming it through the Ministry of Tourism portal. Our team verifies the CONFOTUR status of each project before listing it in our catalog and provides you with the corresponding documentation.",
            question_fr: "Comment savoir si un projet bénéficie réellement de l'approbation CONFOTUR ?",
            answer_fr: "Le projet doit disposer d'une résolution officielle du Conseil de Développement Touristique. Vous pouvez le vérifier en demandant le numéro de résolution CONFOTUR et en le confirmant sur le portail du Ministère du Tourisme. Notre équipe vérifie le statut CONFOTUR de chaque projet avant de l'inclure dans notre catalogue et vous fournit la documentation correspondante."
        },
        {
            id: "faq-017",
            category: "confotur",
            question: "¿CONFOTUR aplica si soy extranjero o tengo doble nacionalidad?",
            answer: "Sí, CONFOTUR aplica independientemente de tu nacionalidad. El beneficio está vinculado al proyecto, no al comprador. Ya seas dominicano residente en el exterior, dominicano con doble nacionalidad o extranjero, disfrutas de las mismas exoneraciones fiscales siempre que la propiedad esté dentro de un proyecto con CONFOTUR aprobado.",
            question_en: "Does CONFOTUR apply if I am a foreigner or have dual citizenship?",
            answer_en: "Yes, CONFOTUR applies regardless of your nationality. The benefit is tied to the project, not the buyer. Whether you are a Dominican living abroad, a dual citizen, or a foreign national, you enjoy the same tax exemptions as long as the property is within a CONFOTUR-approved project.",
            question_fr: "CONFOTUR s'applique-t-il si je suis étranger ou si j'ai la double nationalité ?",
            answer_fr: "Oui, CONFOTUR s'applique indépendamment de votre nationalité. L'avantage est lié au projet, pas à l'acheteur. Que vous soyez Dominicain résidant à l'étranger, détenteur d'une double nationalité ou ressortissant étranger, vous bénéficiez des mêmes exonérations fiscales tant que la propriété se trouve dans un projet approuvé CONFOTUR."
        },
        {
            id: "faq-018",
            category: "confotur",
            question: "¿Qué pasa cuando se vence el período CONFOTUR?",
            answer: "Al expirar el período de exoneración (generalmente 15 años), la propiedad queda sujeta a los impuestos regulares: IPI anual y ganancia de capital al vender. Sin embargo, muchos inversionistas optan por vender antes de que expire el beneficio para maximizar su retorno. Algunos proyectos también han logrado extensiones del período CONFOTUR.",
            question_en: "What happens when the CONFOTUR period expires?",
            answer_en: "When the exemption period expires (typically 15 years), the property becomes subject to regular taxes: annual Property Tax and capital gains tax upon sale. However, many investors choose to sell before the benefit expires to maximize their returns. Some projects have also obtained extensions of the CONFOTUR period.",
            question_fr: "Que se passe-t-il à l'expiration de la période CONFOTUR ?",
            answer_fr: "À l'expiration de la période d'exonération (généralement 15 ans), la propriété devient soumise aux impôts réguliers : impôt foncier annuel et impôt sur les plus-values à la revente. Cependant, de nombreux investisseurs choisissent de vendre avant l'expiration de l'avantage pour maximiser leur rendement. Certains projets ont également obtenu des prolongations de la période CONFOTUR."
        },

        // ── Proceso de Compra ──────────────────────────────────
        {
            id: "faq-019",
            category: "proceso",
            question: "¿Cuáles son los pasos para comprar una propiedad?",
            answer: "El proceso tiene 5 pasos principales: (1) Seleccionar el proyecto y la unidad, (2) Firmar un acuerdo de reserva con depósito inicial, (3) Realizar due diligence legal y firmar el contrato de compraventa, (4) Completar los pagos según el plan acordado, y (5) Recibir la propiedad y registrar el título a tu nombre. Todo el proceso puede tomar entre 3 y 24 meses dependiendo de si es preventa o propiedad terminada.",
            question_en: "What are the steps to buy a property?",
            answer_en: "The process has 5 main steps: (1) Select the project and unit, (2) Sign a reservation agreement with an initial deposit, (3) Conduct legal due diligence and sign the purchase agreement, (4) Complete payments according to the agreed plan, and (5) Receive the property and register the title in your name. The entire process can take 3 to 24 months depending on whether it is pre-sale or a completed property.",
            question_fr: "Quelles sont les étapes pour acheter une propriété ?",
            answer_fr: "Le processus comprend 5 étapes principales : (1) Sélectionner le projet et l'unité, (2) Signer un accord de réservation avec un dépôt initial, (3) Effectuer la vérification juridique (due diligence) et signer le contrat de vente, (4) Effectuer les paiements selon le plan convenu, et (5) Recevoir la propriété et enregistrer le titre à votre nom. L'ensemble du processus peut prendre de 3 à 24 mois selon qu'il s'agit d'une prévente ou d'une propriété achevée."
        },
        {
            id: "faq-020",
            category: "proceso",
            question: "¿Qué documentos necesito para comprar?",
            answer: "Los documentos básicos son: cédula dominicana o pasaporte vigente, comprobante de ingresos o estados de cuenta bancarios, y comprobante de dirección en tu país de residencia. Si financias con banco, necesitarás documentación adicional como historial crediticio, carta de empleo y declaración de impuestos. Un abogado local te guiará con los requisitos específicos.",
            question_en: "What documents do I need to buy a property?",
            answer_en: "The basic documents are: a Dominican ID card or valid passport, proof of income or bank statements, and proof of address in your country of residence. If you are financing through a bank, you will need additional documentation such as credit history, employment letter, and tax returns. A local attorney will guide you through the specific requirements.",
            question_fr: "Quels documents sont nécessaires pour acheter ?",
            answer_fr: "Les documents de base sont : une cédula dominicaine ou un passeport en cours de validité, un justificatif de revenus ou des relevés bancaires, et un justificatif de domicile dans votre pays de résidence. Si vous financez par une banque, vous aurez besoin de documents supplémentaires comme un historique de crédit, une attestation d'emploi et une déclaration d'impôts. Un avocat local vous guidera sur les exigences spécifiques."
        },
        {
            id: "faq-021",
            category: "proceso",
            question: "¿Cuánto tiempo toma el proceso completo de compra?",
            answer: "Para una propiedad terminada, el proceso desde la reserva hasta el título de propiedad registrado toma entre 2 y 4 meses. Para proyectos en preventa, el cierre final ocurre al completar la construcción (12-24 meses típicamente). El registro del título de propiedad ante el Registro de Títulos puede tomar entre 30 y 90 días adicionales después del cierre.",
            question_en: "How long does the full purchase process take?",
            answer_en: "For a completed property, the process from reservation to registered title takes 2 to 4 months. For pre-sale projects, the final closing occurs upon completion of construction (typically 12-24 months). Title registration with the Land Registry can take an additional 30 to 90 days after closing.",
            question_fr: "Combien de temps prend le processus d'achat complet ?",
            answer_fr: "Pour une propriété achevée, le processus de la réservation au titre de propriété enregistré prend entre 2 et 4 mois. Pour les projets en prévente, la clôture finale intervient à l'achèvement de la construction (12 à 24 mois en général). L'enregistrement du titre auprès du Bureau d'enregistrement foncier peut prendre 30 à 90 jours supplémentaires après la clôture."
        },
        {
            id: "faq-022",
            category: "proceso",
            question: "¿Qué es un fideicomiso y por qué es importante?",
            answer: "Un fideicomiso inmobiliario es un mecanismo legal donde tus pagos se depositan en una cuenta administrada por una entidad financiera autorizada, no directamente a la constructora. Los fondos se liberan al constructor según el avance de la obra verificado. Esto protege tu inversión en caso de que la constructora enfrente problemas financieros durante la construcción.",
            question_en: "What is an escrow trust and why is it important?",
            answer_en: "A real estate trust (fideicomiso) is a legal mechanism where your payments are deposited into an account managed by an authorized financial institution, not directly to the developer. Funds are released to the builder based on verified construction progress. This protects your investment in case the developer faces financial difficulties during construction.",
            question_fr: "Qu'est-ce qu'un fidéicommis immobilier et pourquoi est-ce important ?",
            answer_fr: "Un fidéicommis immobilier est un mécanisme juridique dans lequel vos paiements sont déposés sur un compte géré par un établissement financier agréé, et non directement auprès du promoteur. Les fonds sont libérés au constructeur en fonction de l'avancement vérifié des travaux. Cela protège votre investissement en cas de difficultés financières du promoteur pendant la construction."
        },
        {
            id: "faq-023",
            category: "proceso",
            question: "¿Necesito viajar a RD para comprar una propiedad?",
            answer: "No es estrictamente necesario. Puedes otorgar un poder notarial a un abogado de confianza en RD para que firme en tu representación. La reserva, los pagos y gran parte del proceso se manejan de forma remota. Sin embargo, recomendamos al menos una visita para conocer el proyecto y la zona antes de completar la compra, especialmente en propiedades de alto valor.",
            question_en: "Do I need to travel to the DR to buy a property?",
            answer_en: "Not necessarily. You can grant power of attorney to a trusted lawyer in the DR to sign on your behalf. The reservation, payments, and much of the process can be handled remotely. However, we recommend at least one visit to see the project and the area before completing the purchase, especially for high-value properties.",
            question_fr: "Dois-je me rendre en RD pour acheter une propriété ?",
            answer_fr: "Ce n'est pas strictement nécessaire. Vous pouvez accorder une procuration à un avocat de confiance en RD pour qu'il signe en votre nom. La réservation, les paiements et une grande partie du processus peuvent être gérés à distance. Cependant, nous recommandons au moins une visite pour découvrir le projet et la zone avant de finaliser l'achat, surtout pour les propriétés de grande valeur."
        },
        {
            id: "faq-024",
            category: "proceso",
            question: "¿Qué pasa si la constructora no cumple con los plazos de entrega?",
            answer: "Un buen contrato de compraventa incluye cláusulas de penalización por retrasos y condiciones de reembolso. Si el proyecto opera con fideicomiso, tus fondos están protegidos. Es fundamental que tu abogado revise estas cláusulas antes de firmar. En nuestro catálogo priorizamos constructoras con historial comprobado de entregas a tiempo.",
            question_en: "What happens if the developer does not meet the delivery deadlines?",
            answer_en: "A well-drafted purchase agreement includes penalty clauses for delays and refund conditions. If the project operates through an escrow trust, your funds are protected. It is essential that your attorney reviews these clauses before signing. In our catalog, we prioritize developers with a proven track record of on-time deliveries.",
            question_fr: "Que se passe-t-il si le promoteur ne respecte pas les délais de livraison ?",
            answer_fr: "Un bon contrat de vente comprend des clauses de pénalité pour retard et des conditions de remboursement. Si le projet fonctionne avec un fidéicommis, vos fonds sont protégés. Il est essentiel que votre avocat examine ces clauses avant de signer. Dans notre catalogue, nous privilégions les promoteurs ayant un historique avéré de livraisons dans les délais."
        },

        // ── Desde el Exterior ──────────────────────────────────
        {
            id: "faq-025",
            category: "diaspora",
            question: "¿Puedo comprar una propiedad en RD si vivo en Estados Unidos?",
            answer: "Absolutamente sí. Miles de dominicanos en Estados Unidos invierten en propiedades en RD cada año. No necesitas ser residente en RD para comprar. El proceso se puede manejar mayormente de forma remota con apoyo de un abogado local y poder notarial. Los pagos se realizan por transferencia bancaria internacional.",
            question_en: "Can I buy property in the DR if I live in the United States?",
            answer_en: "Absolutely. Thousands of Dominicans in the United States invest in DR properties every year. You do not need to be a resident of the DR to purchase. The process can be handled mostly remotely with the support of a local attorney and power of attorney. Payments are made via international bank wire transfer.",
            question_fr: "Puis-je acheter une propriété en RD si je vis aux États-Unis ?",
            answer_fr: "Absolument. Des milliers de Dominicains aux États-Unis investissent chaque année dans l'immobilier en RD. Vous n'avez pas besoin d'être résident en RD pour acheter. Le processus peut être géré en grande partie à distance avec l'aide d'un avocat local et d'une procuration. Les paiements s'effectuent par virement bancaire international."
        },
        {
            id: "faq-026",
            category: "diaspora",
            question: "¿Cómo administro mi propiedad si vivo en el exterior?",
            answer: "Muchos proyectos en zonas turísticas ofrecen servicios de administración de propiedades (property management) que se encargan de la renta vacacional, mantenimiento, limpieza y atención a huéspedes. El costo típico es entre un 15% y un 25% de los ingresos por renta. Algunos proyectos incluyen este servicio como parte del condominio.",
            question_en: "How do I manage my property if I live abroad?",
            answer_en: "Many projects in tourist areas offer property management services that handle vacation rentals, maintenance, cleaning, and guest services. The typical cost is between 15% and 25% of rental income. Some projects include this service as part of the condo fees.",
            question_fr: "Comment gérer ma propriété si je vis à l'étranger ?",
            answer_fr: "De nombreux projets dans les zones touristiques offrent des services de gestion locative qui s'occupent de la location saisonnière, de l'entretien, du ménage et de l'accueil des clients. Le coût typique se situe entre 15 % et 25 % des revenus locatifs. Certains projets incluent ce service dans les charges de copropriété."
        },
        {
            id: "faq-027",
            category: "diaspora",
            question: "¿Tengo obligaciones fiscales en EE.UU. por tener una propiedad en RD?",
            answer: "Sí, como residente fiscal de EE.UU. debes reportar tus ingresos mundiales al IRS, incluyendo ingresos por renta en RD. También debes reportar cuentas bancarias extranjeras (FBAR) si el balance supera $10,000. Te recomendamos consultar con un contador especializado en impuestos internacionales para cumplir con ambas jurisdicciones y aprovechar tratados de doble tributación.",
            question_en: "Do I have U.S. tax obligations for owning property in the DR?",
            answer_en: "Yes, as a U.S. tax resident you must report your worldwide income to the IRS, including rental income from the DR. You must also report foreign bank accounts (FBAR) if the balance exceeds $10,000. We recommend consulting with an accountant who specializes in international taxes to comply with both jurisdictions and take advantage of double taxation treaties.",
            question_fr: "Ai-je des obligations fiscales aux États-Unis si je possède un bien en RD ?",
            answer_fr: "Oui, en tant que résident fiscal américain, vous devez déclarer vos revenus mondiaux à l'IRS, y compris les revenus locatifs provenant de la RD. Vous devez également déclarer les comptes bancaires étrangers (FBAR) si le solde dépasse 10 000 USD. Nous vous recommandons de consulter un comptable spécialisé en fiscalité internationale pour respecter les obligations des deux juridictions et tirer parti des conventions de double imposition."
        },
        {
            id: "faq-028",
            category: "diaspora",
            question: "¿Puedo rentar mi propiedad en Airbnb cuando no la estoy usando?",
            answer: "Sí, y es una de las estrategias de inversión más populares. Muchos de nuestros proyectos están diseñados específicamente para renta vacacional y están marcados como \"Airbnb-friendly\". Algunos incluso ofrecen programas de rental pool donde la administración se encarga de todo. Las zonas turísticas como Punta Cana y Bayahibe tienen alta demanda durante todo el año.",
            question_en: "Can I rent my property on Airbnb when I am not using it?",
            answer_en: "Yes, and it is one of the most popular investment strategies. Many of our projects are designed specifically for vacation rentals and are listed as \"Airbnb-friendly.\" Some even offer rental pool programs where management handles everything. Tourist areas like Punta Cana and Bayahibe have high demand year-round.",
            question_fr: "Puis-je louer ma propriété sur Airbnb quand je ne l'utilise pas ?",
            answer_fr: "Oui, et c'est l'une des stratégies d'investissement les plus populaires. Nombre de nos projets sont conçus spécifiquement pour la location saisonnière et sont identifiés comme « Airbnb-friendly ». Certains proposent même des programmes de pool locatif où la gestion est entièrement prise en charge. Les zones touristiques comme Punta Cana et Bayahibe bénéficient d'une forte demande tout au long de l'année."
        },
        {
            id: "faq-029",
            category: "diaspora",
            question: "¿Puedo comprar si vivo en Europa o Canadá?",
            answer: "Sí, República Dominicana permite la compra de inmuebles por parte de cualquier persona, sin importar su país de residencia. El proceso es el mismo que para compradores desde EE.UU. Las transferencias bancarias internacionales desde Europa o Canadá se procesan sin problema. Solo debes considerar las regulaciones fiscales de tu país de residencia respecto a propiedades en el exterior.",
            question_en: "Can I buy if I live in Europe or Canada?",
            answer_en: "Yes, the Dominican Republic allows property purchases by anyone, regardless of their country of residence. The process is the same as for buyers from the U.S. International bank transfers from Europe or Canada are processed without issue. You should simply be aware of your country's tax regulations regarding foreign property ownership.",
            question_fr: "Puis-je acheter si je vis en Europe ou au Canada ?",
            answer_fr: "Oui, la République dominicaine permet l'achat de biens immobiliers par toute personne, quel que soit son pays de résidence. Le processus est le même que pour les acheteurs depuis les États-Unis. Les virements bancaires internationaux depuis l'Europe ou le Canada sont traités sans difficulté. Vous devez simplement tenir compte de la réglementation fiscale de votre pays de résidence concernant les propriétés à l'étranger."
        },
        {
            id: "faq-030",
            category: "diaspora",
            question: "¿Qué pasa con mi propiedad durante huracanes u otros eventos climáticos?",
            answer: "Los proyectos modernos en RD se construyen con estándares antisísmicos y resistentes a huracanes. Es altamente recomendable contratar un seguro de propiedad que cubra daños por eventos climáticos. Las administradoras de propiedades también se encargan de los protocolos de preparación y respuesta ante tormentas. El costo del seguro varía según la ubicación y el valor de la propiedad.",
            question_en: "What happens to my property during hurricanes or other weather events?",
            answer_en: "Modern projects in the DR are built to seismic and hurricane-resistant standards. It is highly recommended to purchase property insurance that covers weather-related damage. Property management companies also handle storm preparation and response protocols. Insurance costs vary depending on the location and property value.",
            question_fr: "Que se passe-t-il pour ma propriété en cas d'ouragan ou d'autre événement climatique ?",
            answer_fr: "Les projets modernes en RD sont construits selon des normes antisismiques et résistantes aux ouragans. Il est fortement recommandé de souscrire une assurance habitation couvrant les dommages liés aux événements climatiques. Les sociétés de gestion immobilière s'occupent également des protocoles de préparation et de réponse aux tempêtes. Le coût de l'assurance varie selon l'emplacement et la valeur de la propriété."
        },

        // ── Legal ──────────────────────────────────────────────
        {
            id: "faq-031",
            category: "legal",
            question: "¿Los extranjeros pueden ser dueños de propiedades en RD?",
            answer: "Sí, la Constitución dominicana garantiza el derecho de propiedad a todas las personas, sin importar su nacionalidad. No existen restricciones para que extranjeros compren, posean o vendan bienes inmuebles en República Dominicana. Tendrás los mismos derechos de propiedad que un ciudadano dominicano, incluyendo la obtención de un Certificado de Título a tu nombre.",
            question_en: "Can foreigners own property in the DR?",
            answer_en: "Yes, the Dominican Constitution guarantees the right of property ownership to all individuals, regardless of nationality. There are no restrictions on foreigners buying, owning, or selling real estate in the Dominican Republic. You will have the same property rights as a Dominican citizen, including obtaining a Certificate of Title in your name.",
            question_fr: "Les étrangers peuvent-ils être propriétaires en RD ?",
            answer_fr: "Oui, la Constitution dominicaine garantit le droit de propriété à toute personne, quelle que soit sa nationalité. Il n'existe aucune restriction pour les étrangers souhaitant acheter, posséder ou vendre des biens immobiliers en République dominicaine. Vous bénéficierez des mêmes droits de propriété qu'un citoyen dominicain, y compris l'obtention d'un Certificat de Titre à votre nom."
        },
        {
            id: "faq-032",
            category: "legal",
            question: "¿Qué es el Certificado de Título y por qué es importante?",
            answer: "El Certificado de Título es el documento oficial emitido por el Registro de Títulos que certifica tu propiedad sobre un inmueble. Es la prueba legal definitiva de que eres el dueño. En RD, el sistema de registro es Torrens, lo que significa que el título registrado es inatacable. Nunca compres una propiedad sin verificar que tenga título limpio y registrado.",
            question_en: "What is the Certificate of Title and why is it important?",
            answer_en: "The Certificate of Title is the official document issued by the Land Registry that certifies your ownership of a property. It is the definitive legal proof that you are the owner. The DR uses the Torrens registration system, which means a registered title is incontestable. Never purchase a property without verifying that it has a clean, registered title.",
            question_fr: "Qu'est-ce que le Certificat de Titre et pourquoi est-il important ?",
            answer_fr: "Le Certificat de Titre est le document officiel délivré par le Bureau d'enregistrement foncier qui atteste votre droit de propriété sur un bien immobilier. C'est la preuve juridique définitive que vous en êtes le propriétaire. La RD utilise le système d'enregistrement Torrens, ce qui signifie qu'un titre enregistré est inattaquable. N'achetez jamais un bien sans vérifier qu'il possède un titre propre et enregistré."
        },
        {
            id: "faq-033",
            category: "legal",
            question: "¿Necesito un abogado para comprar una propiedad?",
            answer: "Aunque no es legalmente obligatorio, es altamente recomendable contratar un abogado inmobiliario independiente. El abogado realizará el due diligence (verificación de título, cargas, gravámenes), revisará el contrato de compraventa, representará tus intereses en el cierre y gestionará el registro del título. El costo típico es entre 1% y 2% del valor de la propiedad.",
            question_en: "Do I need a lawyer to buy a property?",
            answer_en: "While not legally required, it is highly recommended to hire an independent real estate attorney. The lawyer will conduct due diligence (title verification, liens, encumbrances), review the purchase agreement, represent your interests at closing, and manage the title registration. The typical cost is between 1% and 2% of the property value.",
            question_fr: "Ai-je besoin d'un avocat pour acheter une propriété ?",
            answer_fr: "Bien que ce ne soit pas juridiquement obligatoire, il est fortement recommandé de faire appel à un avocat immobilier indépendant. L'avocat effectuera la vérification préalable (vérification du titre, charges, hypothèques), examinera le contrat de vente, représentera vos intérêts lors de la clôture et gérera l'enregistrement du titre. Le coût typique se situe entre 1 % et 2 % de la valeur du bien."
        },
        {
            id: "faq-034",
            category: "legal",
            question: "¿Qué es el due diligence y qué incluye?",
            answer: "El due diligence es la investigación legal que se realiza antes de comprar para verificar que todo está en orden. Incluye: verificación del Certificado de Título en el Registro de Títulos, búsqueda de gravámenes o embargos, verificación de que la constructora tiene permisos de construcción vigentes, revisión de planos aprobados y confirmación del estatus CONFOTUR si aplica.",
            question_en: "What is due diligence and what does it include?",
            answer_en: "Due diligence is the legal investigation conducted before purchasing to verify that everything is in order. It includes: verification of the Certificate of Title at the Land Registry, search for liens or seizures, confirmation that the developer holds valid construction permits, review of approved plans, and verification of CONFOTUR status if applicable.",
            question_fr: "Qu'est-ce que la vérification préalable (due diligence) et que comprend-elle ?",
            answer_fr: "La vérification préalable est l'enquête juridique effectuée avant l'achat pour s'assurer que tout est en ordre. Elle comprend : la vérification du Certificat de Titre au Bureau d'enregistrement foncier, la recherche d'hypothèques ou de saisies, la vérification que le promoteur dispose de permis de construire en cours de validité, l'examen des plans approuvés et la confirmation du statut CONFOTUR le cas échéant."
        },
        {
            id: "faq-035",
            category: "legal",
            question: "¿Qué impuestos debo pagar como propietario en RD?",
            answer: "Los impuestos principales son: Impuesto de Transferencia Inmobiliaria (3% al comprar, exento con CONFOTUR), Impuesto a la Propiedad Inmobiliaria o IPI (1% anual sobre valor excedente de ~RD$9.86M, exento con CONFOTUR), e impuesto sobre la renta por ingresos de alquiler (escala de 15-25%). Al vender, se aplica ganancia de capital (27%, exento con CONFOTUR).",
            question_en: "What taxes do I pay as a property owner in the DR?",
            answer_en: "The main taxes are: Real Estate Transfer Tax (3% at purchase, exempt with CONFOTUR), Annual Property Tax or IPI (1% on value exceeding ~RD$9.86M, exempt with CONFOTUR), and income tax on rental income (15-25% scale). Upon sale, capital gains tax applies (27%, exempt with CONFOTUR).",
            question_fr: "Quels impôts dois-je payer en tant que propriétaire en RD ?",
            answer_fr: "Les principaux impôts sont : la taxe de transfert immobilier (3 % à l'achat, exonérée avec CONFOTUR), l'impôt foncier annuel ou IPI (1 % sur la valeur excédant environ 9,86 millions RD$, exonéré avec CONFOTUR), et l'impôt sur le revenu pour les revenus locatifs (barème de 15-25 %). À la revente, l'impôt sur les plus-values s'applique (27 %, exonéré avec CONFOTUR)."
        },
        {
            id: "faq-036",
            category: "legal",
            question: "¿Puedo poner la propiedad a nombre de una empresa o fideicomiso?",
            answer: "Sí, puedes adquirir la propiedad a nombre de una persona física o de una entidad jurídica (SRL, SA, fideicomiso). Comprar a través de una empresa puede ofrecer ventajas fiscales y de protección de activos, además de facilitar la sucesión. Consulta con un abogado y contador para determinar la estructura más conveniente según tu situación particular.",
            question_en: "Can I put the property under a company or trust?",
            answer_en: "Yes, you can acquire the property under an individual name or a legal entity (SRL, SA, trust). Purchasing through a company can offer tax advantages and asset protection, as well as simplify succession planning. Consult with an attorney and accountant to determine the most suitable structure for your particular situation.",
            question_fr: "Puis-je mettre la propriété au nom d'une entreprise ou d'un fidéicommis ?",
            answer_fr: "Oui, vous pouvez acquérir la propriété au nom d'une personne physique ou d'une entité juridique (SRL, SA, fidéicommis). L'achat par l'intermédiaire d'une société peut offrir des avantages fiscaux et une protection des actifs, tout en facilitant la planification successorale. Consultez un avocat et un comptable pour déterminer la structure la plus adaptée à votre situation particulière."
        }
    ]
};
