const { KNOWLEDGE_BASE } = require('./knowledgeBase');

/**
 * Perform keyword-weighted ranking and snippet retrieval (RAG context retriever)
 */
function retrieveRelevantContext(query, topK = 3) {
  if (!query || typeof query !== "string") return [];

  const tokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2);

  const scored = KNOWLEDGE_BASE.map(item => {
    let score = 0;
    const itemText = (item.category + " " + item.keywords.join(" ") + " " + item.content).toLowerCase();

    tokens.forEach(token => {
      // Keyword exact hit boost
      if (item.keywords.some(kw => kw.toLowerCase().includes(token))) {
        score += 5;
      }
      // General text hit
      const matches = itemText.split(token).length - 1;
      score += matches * 2;
    });

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.item);
}

/**
 * Generate answer using OpenRouter LLM API with RAG context fallback
 */
async function answerUserQuery(userQuery, conversationHistory = []) {
  const contexts = retrieveRelevantContext(userQuery, 3);
  const contextText = contexts.map(c => `### ${c.category}:\n${c.content}`).join("\n\n");

  const openRouterKey = process.env.OPENROUTER_API_KEY;

  const systemPrompt = `You are the EcoSankalp assistant. Talk like a real, helpful human expert—clear, friendly, conversational, and direct.

CRITICAL TONE GUIDELINES (HUMANIZED):
1. Never sound like a generic corporate AI brochure. Avoid buzzwords like "delve", "testament", "pivotal", "embark", "harness", "leverage", "in today's world", "realm", "crucial landscape".
2. Write naturally, as if answering a teammate or customer on Slack or WhatsApp.
3. Use plain sentences, clear steps, and short paragraphs.
4. When explaining formulas or numbers, explain what the numbers actually mean in plain English.
5. If something is on the website (like Carbon Sahayak, Marketplace, or your Wallet pill in the top bar), point them right to it.
6. If the user asks something outside EcoSankalp, give a short friendly reply and guide them back.

Here is the verified context from our platform:
${contextText}`;

  // If OpenRouter key is provided and not default placeholder, query OpenRouter
  if (openRouterKey && openRouterKey !== 'your_openrouter_api_key' && openRouterKey.startsWith('sk-or-')) {
    try {
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.slice(-4).map(m => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.content
        })),
        { role: "user", content: userQuery }
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "HTTP-Referer": "https://ecosankalp.org",
          "X-Title": "EcoSankalp Assistant",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct",
          messages: messages,
          temperature: 0.4,
          max_tokens: 500
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return {
            reply,
            sources: contexts.map(c => c.category)
          };
        }
      }
      console.warn("OpenRouter API returned non-OK status, falling back to local RAG responder.");
    } catch (err) {
      console.error("OpenRouter request error:", err.message);
    }
  }

  // Fallback intelligent humanized RAG synthesis (runs offline even without an active OpenRouter API key)
  return generateHumanizedRAGSynthesis(userQuery, contexts);
}

/**
 * Humanized, natural conversational RAG responder
 */
function generateHumanizedRAGSynthesis(query, contexts) {
  const q = (query || "").toLowerCase().trim();

  // Friendly greetings & casual hellos
  if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|namaste|hola)(\b|!|\.)/i.test(q) || q === "hi" || q === "hello" || q === "hey") {
    return {
      reply: "Hey there! 👋 Welcome to EcoSankalp.\n\nI'm your assistant here. You can ask me anything about:\n• How our **Carbon Sahayak** calculator estimates emission savings\n• How we verify and mint credits on **Polygon Amoy** blockchain\n• Buying or listing credits on the **Marketplace**\n• Checking your **wallet balance** and purchase history\n\nWhat can I help you with today?",
      sources: ["EcoSankalp"]
    };
  }

  // General platform / what is this website / about
  if (q.includes("what is") && (q.includes("ecosankalp") || q.includes("this") || q.includes("platform") || q.includes("website")) ||
      q.includes("about") || q.includes("overview") || q.includes("how does it work") || q.includes("help me understand")) {
    return {
      reply: "EcoSankalp is an open platform where real-world waste management and climate projects get rewarded with certified carbon credits.\n\nHere is how everything connects:\n\n" +
        "1. **Calculate Savings (Carbon Sahayak):** Organizations plug in their daily wet/dry waste numbers. Our engine calculates how much methane and CO₂ are prevented from entering the atmosphere using IPCC standards.\n\n" +
        "2. **On-Chain Verification:** Approved credits are tokenized as ERC-1155 smart contracts on the Polygon Amoy blockchain. This ensures every credit is unique, traceable, and impossible to fake.\n\n" +
        "3. **Transparent Marketplace:** Buyers can purchase credits in Indian Rupees (₹) to offset their carbon footprint. When bought, the credit is permanently retired and a verified certificate is issued.\n\n" +
        "4. **Built-in Smart Wallet:** No crypto plugins or seed phrases required! Just click the wallet address pill in the top bar to view your live balance and transaction history.\n\n" +
        "Are you interested in calculating credits, exploring marketplace listings, or understanding our blockchain verification?",
      sources: ["Platform Overview"]
    };
  }

  if (q.includes("calculate") || q.includes("formula") || q.includes("methane") || q.includes("equation") || q.includes("sahayak") || q.includes("math")) {
    return {
      reply: "In **Carbon Sahayak**, we estimate carbon credits using the standard IPCC landfill equation:\n\n" +
        "**E = Waste (tonnes) × DOC × DOC_f × F × (16/12) × GWP_CH₄**\n\n" +
        "Here is what those terms mean in plain, everyday English:\n" +
        "• **DOC (0.15):** The organic fraction in wet/kitchen waste that naturally decomposes.\n" +
        "• **DOC_f (0.50):** The portion that actually rots in open dumps.\n" +
        "• **F (0.50):** Landfill gas is roughly 50% methane.\n" +
        "• **GWP_CH₄ (28):** Methane traps 28 times more heat in the atmosphere than CO₂ over 100 years.\n\n" +
        "**Real-world impact:**\n" +
        "• Composting wet waste saves about **0.45 tonnes of CO₂e per tonne**.\n" +
        "• Bio-methanation (biogas energy) saves **0.65 to 0.85 tonnes of CO₂e per tonne**.\n\n" +
        "You can enter your own project's tonnage in the **Carbon Sahayak** tab to see your credits calculated live!",
      sources: ["Calculations & Formulas"]
    };
  }

  if (q.includes("blockchain") || q.includes("polygon") || q.includes("amoy") || q.includes("hash") || q.includes("tx") || q.includes("smart contract") || q.includes("erc-1155")) {
    return {
      reply: "We record every credit action on the **Polygon Amoy testnet** so nothing can be faked, duplicated, or double-sold.\n\n" +
        "Here is how that works for you:\n" +
        "• **Tokenized Assets:** Verified credits are minted as ERC-1155 tokens directly on-chain.\n" +
        "• **Audit Trails:** Every creation, purchase, and retirement gets a unique transaction hash starting with `0x...`.\n" +
        "• **Public Verification:** You can click that hash anytime to see the block, gas, and confirmation status live on PolygonScan.\n" +
        "• **Retirement Guarantee:** Once a buyer claims an offset, the token is burned on-chain so it cannot be resold.\n\n" +
        "It gives buyers and auditors 100% transparent proof of their climate impact.",
      sources: ["Blockchain & Smart Contracts"]
    };
  }

  if (q.includes("wallet") || q.includes("balance") || q.includes("metamask") || q.includes("transaction") || q.includes("history") || q.includes("drawer")) {
    return {
      reply: "We built an **Eco-Custodial Smart Wallet** right into the app so you never have to deal with MetaMask extensions or seed phrases.\n\n" +
        "• **Accessing your wallet:** Click your wallet address pill (e.g., `0x708a...3638`) in the top navigation bar to open your wallet drawer.\n" +
        "• **What you will see:** Your total carbon credit balance in **tCO₂e**, your total spending in **₹**, and a complete history of all your purchases.\n" +
        "• **Live Explorer:** Each purchase has a direct link to PolygonScan so you can verify the transaction on the blockchain anytime.",
      sources: ["Smart Custodial Eco-Wallet"]
    };
  }

  if (q.includes("buy") || q.includes("sell") || q.includes("price") || q.includes("marketplace") || q.includes("purchase") || q.includes("retire")) {
    return {
      reply: "Our **Marketplace** connects verified green projects with buyers looking to offset emissions:\n\n" +
        "• **For Buyers:** Switch to the **Marketplace** tab, browse projects by sector (waste management, solar, etc.), and click **View Details & Buy**. Prices are shown transparently in rupees (₹). Upon purchase, you receive an immediate, tamper-proof retirement certificate.\n" +
        "• **For Organizations (Sellers):** Once your project is verified by an admin, you choose your price per tonne (₹/tCO₂e) and list it for sale.\n\n" +
        "Need help picking a project or understanding retirement certificates?",
      sources: ["Carbon Marketplace"]
    };
  }

  if (q.includes("segregat") || q.includes("wet waste") || q.includes("dry waste") || q.includes("waste")) {
    return {
      reply: "Source segregation is the foundation of genuine carbon credits.\n\n" +
        "Here is why separating waste at source is so effective:\n" +
        "• **Wet Waste:** When food and organic waste sit in an open landfill, they decay anaerobically and pump heavy methane into the air. Segregating wet waste allows it to be composted or fed into biogas digesters.\n" +
        "• **Dry Waste:** Clean plastics, cardboard, glass, and metals can be mechanically recycled, saving **1.2 to 2.8 tCO₂e per tonne** compared to manufacturing from virgin materials.\n\n" +
        "In Carbon Sahayak, higher segregation efficiency directly increases your verified credits!",
      sources: ["Waste Management"]
    };
  }

  if (q.includes("verif") || q.includes("cpcb") || q.includes("admin") || q.includes("audit") || q.includes("lifecycle") || q.includes("mint")) {
    return {
      reply: "Every carbon credit on EcoSankalp goes through a rigorous four-step verification cycle:\n\n" +
        "1. **Submission:** Project developers submit their tonnage records, methodology, and geo-tagged data.\n" +
        "2. **Admin & Standard Audit:** The submission is audited against Central Pollution Control Board (CPCB) and CCTS protocols.\n" +
        "3. **On-Chain Minting:** Once approved, our smart contract mints verified ERC-1155 tokens on Polygon Amoy.\n" +
        "4. **Marketplace Listing & Retirement:** The project lists the credits for sale, and buyers retire them with permanent proof.\n\n" +
        "This ensures every credit corresponds to real, verified environmental action.",
      sources: ["Credit Lifecycle & Verification"]
    };
  }

  if (contexts.length === 0) {
    return {
      reply: "I'm happy to help! You can ask me about our carbon calculation formulas, how Polygon Amoy blockchain verification works, or how to buy and retire credits on the marketplace. What would you like to explore?",
      sources: ["EcoSankalp"]
    };
  }

  const primaryContext = contexts[0];
  const cleanedContent = primaryContext.content.replace(/\(in INR \?\)/g, '(in ₹)');

  return {
    reply: `Here are the key details on **${primaryContext.category}**:\n\n` +
      `${cleanedContent}\n\n` +
      `Feel free to ask if you'd like me to explain any specific part or walk you through how to use it!`,
    sources: contexts.map(c => c.category)
  };
}

module.exports = {
  retrieveRelevantContext,
  answerUserQuery
};
