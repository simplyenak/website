// Stories data with categories for Simply Enak blog

export type StoryCategory = {
  name: string;
  slug: string;
  description: string;
};

export type Story = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  categories: string[];
};

export const storyCategories: StoryCategory[] = [
  {
    name: "Culture & Heritage",
    slug: "culture-heritage",
    description: "Stories about Malaysian food culture, traditions, and history"
  },
  {
    name: "Food Culture",
    slug: "food-culture",
    description: "Deep dives into Malaysian food scenes, hawker culture, and eating traditions"
  },
  {
    name: "People & Stories",
    slug: "people-stories",
    description: "Meet the vendors, families, and keepers of Malaysian culinary heritage"
  },
  {
    name: "Travel Tips",
    slug: "travel-tips",
    description: "Practical advice for experiencing Malaysian food like a local"
  },
  {
    name: "Festivals & Celebrations",
    slug: "festivals-celebrations",
    description: "Food traditions during Malaysian festivals and special occasions"
  }
];

export const stories: Story[] = [
  {
    slug: "malaysian-food-heritage",
    title: "The Heritage Behind Malaysian Food",
    excerpt: "Discover how Malaysian cuisine became a melting pot of Malay, Chinese, Indian, and indigenous influences over centuries of trade and cultural exchange.",
    content: `
<p>Malaysian food didn't just happen—it evolved over centuries of migration, trade, and cultural exchange. When Chinese tin miners arrived in the 1850s, they brought wok cooking and noodle traditions. When South Indian laborers came to work rubber plantations, they brought banana leaf curry and roti canai. When Arab and Indian Muslim traders established communities, they created mamak culture—the 24/7 food stalls that feed Malaysia today.</p>

<p>But Malaysian food is more than imported cuisines side by side. The real magic happened in the fusion. Peranakan (Nyonya) cuisine emerged when Chinese traders married local Malay women, blending Chinese techniques with Malay spices. Mamak cuisine evolved when Indian Muslims adapted their cooking for Malay palates. Even nasi lemak—the national dish—tells a story of cultural exchange: coconut rice (Malay), sambal (Indonesian influence), fried anchovies (Chinese), and curry (Indian).</p>

<h3>Three Pillars of Malaysian Food Heritage</h3>

<h4>1. Malay Cuisine - The Foundation</h4>
<p>Malay food is built on coconut, chili, and aromatics. It's kampung (village) cooking that reflects centuries of trade with Indonesia, Thailand, and Arab merchants. Dishes like rendang, sambal, and serunding showcase slow cooking and complex spice pastes (rempah) that take hours to prepare properly.</p>

<h4>2. Chinese Influence - The Technique</h4>
<p>Chinese immigrants brought wok cooking, noodle-making, and food preservation techniques. But they also adapted. Chinese Muslims created halal dim sum. Hokkien mee in Malaysia tastes nothing like its origins—it evolved here into something uniquely Malaysian.</p>

<h4>3. Indian Flavors - The Spice</h4>
<p>South Indian influence gave Malaysia banana leaf curry, roti canai, and teh tarik. But North Indian tandoor cooking also arrived via Muslim traders. The result? A spectrum of Indian cuisines existing nowhere else—from Tamil breakfast to Punjabi dinner to mamak suppers.</p>

<h3>Why This Matters for Food Lovers</h3>

<p>Understanding this heritage transforms how you experience Malaysian food. That char kway teow stall isn't just making "stir-fried noodles"—they're preserving a Hokkien recipe adapted over four generations. That banana leaf curry isn't "Indian food in Malaysia"—it's Malaysian food with Indian roots, evolved through local ingredients and Malay palates.</p>

<p>When you join our tours, you're not just eating—you're tasting 150 years of cultural exchange, migration, and fusion. Every dish has a story. Every vendor has a heritage. And once you know these stories, Malaysian food becomes infinitely more delicious.</p>
    `,
    image: "https://se-website-images.s3.nl-ams.scw.cloud/story-heritage.jpg",
    date: "2024-10-15",
    author: "Simply Enak Team",
    categories: ["Culture & Heritage"]
  },
  {
    slug: "street-food-culture",
    title: "Why Street Food Is the Soul of Malaysia",
    excerpt: "From hawker centers to roadside stalls, street food isn't just about eating—it's where communities gather, stories are shared, and traditions are preserved.",
    content: `
<p>In Malaysia, the best food isn't in restaurants—it's on the street. Hawker stalls, kopitiam, mamak, and night markets are where Malaysians actually eat. It's where families gather after work, where friends catch up over teh tarik, and where you'll find third-generation vendors perfecting recipes their grandparents created.</p>

<p>But Malaysian street food culture is under threat. Rising rents, aging hawkers, and younger generations choosing office jobs mean many stalls are closing forever. UNESCO recognized Georgetown's hawker culture as intangible heritage, but recognition alone can't save it. Only patronage can—locals and visitors supporting these vendors keep traditions alive.</p>

<h3>What Makes Malaysian Street Food Special</h3>

<h4>Generational Expertise</h4>
<p>That char kway teow uncle has been frying noodles for 40 years. His father taught him. His grandfather started the stall. Three generations perfecting one dish. You can't replicate that in a chain restaurant.</p>

<h4>Community Hubs</h4>
<p>Hawker centers aren't just food courts—they're community centers. You'll see the same faces every morning at breakfast, the same groups meeting for dinner. Vendors know their regulars' orders by heart. It's social infrastructure disguised as food infrastructure.</p>

<h4>Honest Pricing</h4>
<p>Street food keeps Malaysian food culture accessible. A filling meal costs RM 8-15. Families can afford to eat out daily. Food remains democratic—everyone eats at the same hawker stalls, from CEOs to students.</p>

<h3>How to Experience Street Food Like a Local</h3>

<p><strong>1. Go Where Locals Queue</strong> - If there's a line at 7am, that breakfast is worth waking up for.</p>

<p><strong>2. Don't Fear the Plastic Stool</strong> - The best food often comes from the humblest stalls. If locals are sitting on small plastic stools at rickety tables, join them.</p>

<p><strong>3. Order What You Don't Recognize</strong> - Point at what the person next to you is eating. You'll discover dishes that don't even make it into guidebooks.</p>

<p><strong>4. Respect the Specialization</strong> - Many stalls make ONE dish. They're not being limited—they're being excellent. Don't ask the char kway teow stall for curry laksa.</p>

<p><strong>5. Support the Veterans</strong> - Older vendors often have the best food. But they're also considering retirement. Your patronage helps them continue.</p>

<h3>The Crisis Nobody Talks About</h3>

<p>Malaysian street food faces a succession crisis. Hawking is hard work—10+ hour days, physical labor, irregular income. Many veteran hawkers have no successors. When they retire, their recipes disappear.</p>

<p>This is why food tours matter. Every time you eat at these stalls, you're voting for their survival. Every time you learn their stories, you're preserving their heritage. Street food culture continues because people care enough to support it.</p>
    `,
    image: "https://se-website-images.s3.nl-ams.scw.cloud/story-street-food.jpg",
    date: "2024-10-10",
    author: "Simply Enak Team",
    categories: ["Food Culture"]
  },
  {
    slug: "family-recipes",
    title: "Family Recipes Passed Down Through Generations",
    excerpt: "Meet the vendors who've been making the same dish for decades, using recipes their grandparents taught them. These are the keepers of Malaysian culinary heritage.",
    content: `
<p>In Georgetown, there's a laksa stall run by three siblings. Their grandmother started it in 1952. Their mother took over in the 1980s. Now the third generation runs it. Same recipe. Same location. Same blue plastic bowls. 72 years of one family making laksa the same way.</p>

<p>This is what we mean by "family recipes." Not just recipes passed down, but entire livelihoods, entire traditions, entire relationships with a community built around one dish. When you eat at these stalls, you're not just a customer—you're part of a story that spans generations.</p>

<h3>Why Family Recipes Matter</h3>

<h4>Consistency Through Time</h4>
<p>Chefs experiment. Home cooks adapt. But hawkers who've been making the same dish for 30 years? They've perfected it. They know exactly how much salt, exactly how high the flame, exactly when to flip the wok. This knowledge can't be written down—it lives in their hands.</p>

<h4>Cultural Preservation</h4>
<p>Many family recipes preserve cooking methods that have disappeared elsewhere. Slow-cooked rendang that takes 8 hours. Roti canai stretched by hand, not machine. Curry pastes pounded with mortar and pestle, not blended. These techniques are endangered. Family vendors are often the last keepers.</p>

<h4>Economic Survival</h4>
<p>For many families, the hawker stall funded education, bought homes, raised children. It's not just about food—it's about family survival and upward mobility. When you support these stalls, you're supporting entire family economies.</p>

<h3>Three Families You Should Know</h3>

<h4>Aunty Lim's Vegetarian Stall (85 years)</h4>
<p>Aunty Lim's family has served Buddhist vegetarian food for four generations. Her great-grandmother started cooking for temple festivals in 1939. Today, Aunty Lim makes the same mock char siu her ancestors created—wheat gluten marinated for hours to achieve that impossible texture and flavor. She's teaching her niece the recipes, but worries younger generations won't have the patience for techniques this slow.</p>

<h4>Uncle Chen's Char Kway Teow (50 years)</h4>
<p>Uncle Chen learned to fry char kway teow from his father, who learned from Penang hawkers in the 1950s. His secret? Using lard (pork fat) for that smoky, savory depth. He estimates he's fried over 500,000 plates. Every morning at 6am, he's at the market selecting the freshest chives. "No shortcuts," he says. "Fresh ingredients, high heat, constant movement. That's all."</p>

<h4>The Nasi Kandar Dynasty (60 years)</h4>
<p>One family runs three nasi kandar shops across Penang, all descended from their grandfather's original stall. The curry recipe is a family secret—each generation is taught before the previous one retires. They mix 23 different spices. The exact proportions? "You have to feel it," they say. "Recipes are guidelines. Experience is the real ingredient."</p>

<h3>How to Show Respect for Family Vendors</h3>

<p><strong>Ask About the History</strong> - Most vendors love sharing their family story. Ask how long they've been there. Ask who taught them. Their eyes light up when people show genuine interest.</p>

<p><strong>Don't Rush Them</strong> - Some dishes take time to prepare properly. If there's a queue, it means the food is worth waiting for. Respect the process.</p>

<p><strong>Return When Possible</strong> - Regulars matter to family vendors. Being recognized, becoming part of "the family's story," creates relationships that transcend transactions.</p>

<p><strong>Support Their Next Generation</strong> - If you see younger family members learning, encourage them. Tell them their heritage matters. The next generation needs to hear that what they're preserving has value beyond just profit.</p>
    `,
    image: "https://se-website-images.s3.nl-ams.scw.cloud/story-family-recipes.jpg",
    date: "2024-10-05",
    author: "Simply Enak Team",
    categories: ["People & Stories"]
  },
  {
    slug: "hari-raya-foods",
    title: "11 Foods To Try During Hari Raya",
    excerpt: "Hari Raya marks the end of Ramadan with a month of celebrations and amazing dishes, many of which can only be found this time of the year.",
    content: `
<p>There's nothing in this world like the food you will find in Malaysia during Hari Raya. Don't get me wrong, we have amazing food all year round and for special occasions, but the delicacies served during Hari Raya are at the top of most of our tourists' "must-have" lists.</p>

<p>Hari Raya marks the end of Ramadan, or the fasting month, for Muslims worldwide, and especially here in Malaysia. So what follows a month of fasting? A whole month of celebrations and eating amazing dishes, many of which can only be found this time of the year. But you don't have to be Muslim to enjoy them and experience everything that Hari Raya has to offer.</p>

<h3>Lemang</h3>
<p>Lemang can take four to five hours just to cook, but I'm here to tell you it is well worth it. The cooking process alone is unique and has gone unchanged since its beginning. Lemang is essentially coconut milk, sticky rice, and a little salt wrapped in fragrant banana leaves, then stuffed into hollow bamboo sticks and roasted over a fire.</p>

<p>The banana leaves stop the rice from sticking to the bamboo tube. You'll know Lemang when you see them all lined up in a row being cooked in stalls. They are set against the fire, slightly slanted then turned every so often so everything gets cooked evenly. The Lemang is then served with shredded beef, chicken or even curries of your liking.</p>

<h3>Ketupat</h3>
<p>Another great way to enjoy rice that tourists and locals line up for is Ketupat, the symbol of Hari Raya Like Lemang, Ketupat is unique and can be served in place of traditional steamed rice.</p>

<p>Ketupat is like a dumpling where rice is packed into a diamond-shaped pocket made from woven palm. It's then boiled. Once fully cooked, the woven palm wrapper is cut and peeled away so the rice inside can be sliced and served with whatever meal you would normally have with regular rice.</p>

<h4>More about Hari Raya</h4>
<ol>
<li>Hari Raya lasts for the whole month</li>
<li>Hari Raya Eidulfitri and Hari Raya Aiduladha is not the same celebration</li>
<li>It's rude to eat or drink while standing up</li>
<li>Guys don't shake hands with ladies in the house</li>
<li>There are no strict rules on gifting</li>
<li>Inauspicious colours are not a thing</li>
<li>Don't visit houses after 9 pm unless you are invited</li>
</ol>
    `,
    image: "https://se-website-images.s3.nl-ams.scw.cloud/hari-raya-foods.jpg",
    date: "2024-06-10",
    author: "Simply Enak Team",
    categories: ["Festivals & Celebrations", "Food Culture"]
  },
  {
    slug: "tourist-vs-local-food",
    title: "Why We Don't Do 'Tourist' Food",
    excerpt: "There's a difference between the food served to tourists and the food locals eat. Here is how to spot the difference and why it matters.",
    content: `
<p>You've seen them. The restaurants with the English menus out front, the photos of food that look a little too perfect, and the staff waving you in. This is "tourist food." It's safe, it's predictable, and it's usually bland.</p>

<p>Real Malaysian food is messy. It's spicy. It's served on plastic plates in humid hawker centers. It's not designed for Instagram; it's designed for flavor.</p>

<h3>The Signs of Authenticity</h3>
<ul>
<li><strong>The Queue:</strong> If locals are lining up, get in line.</li>
<li><strong>The Specialization:</strong> The best stalls sell one thing. Just one.</li>
<li><strong>The Chaos:</strong> A busy, noisy shop is a good sign. Silence is suspicious.</li>
</ul>

<p>When we design our tours, we skip the polished spots. We take you to the places where the uncle yells your order to the kitchen and the auntie scolds you if you don't eat the chili. That's where the magic is.</p>
    `,
    image: "https://se-website-images.s3.nl-ams.scw.cloud/kl-street-food.jpg",
    date: "2024-11-01",
    author: "Simply Enak Team",
    categories: ["Food Culture", "Travel Tips"]
  },
  {
    slug: "satay-master",
    title: "The Satay Master of Kampung Baru",
    excerpt: "Pak Din has been fanning charcoal fires for 40 years. His secret isn't just the marinade—it's the patience.",
    content: `
<p>In the shadow of the Petronas Towers lies Kampung Baru, a traditional Malay village that refuses to change. And in the heart of the village is Pak Din's satay stall.</p>

<p>Most satay today is factory-made. Not Pak Din's. He cuts the meat by hand—turmeric-stained fingers working quickly. He skews it on bamboo sticks he trims himself. And he grills it over charcoal, fanning the flames with a woven fan to control the heat perfectly.</p>

<p>"Gas is for lazy people," he tells us. "Charcoal gives the aroma. You can taste the smoke."</p>

<p>Eating his satay isn't just a meal; it's a lesson in doing things the hard way because it's the right way.</p>
    `,
    image: "https://se-website-images.s3.nl-ams.scw.cloud/satay-grill.jpg",
    date: "2024-11-15",
    author: "Simply Enak Team",
    categories: ["People & Stories"]
  },
  {
    slug: "mamak-culture",
    title: "Understanding Mamak Culture",
    excerpt: "The 24-hour open-air restaurants that serve as Malaysia's living room. Why teh tarik and roti canai unite the nation.",
    content: `
<p>If you want to see the real Malaysia, go to a mamak stall at 2 AM. You'll see students studying, taxi drivers taking a break, football fans watching a match, and families having a late supper. Everyone is there.</p>

<p>Mamak stalls are Indian Muslim establishments, but they belong to everyone. They are the neutral ground of Malaysian society. The food is cheap, the tea is pulled high (teh tarik), and the doors never close.</p>

<p>It's here that you realize food is the glue holding this multicultural nation together. Over a piece of roti canai, differences disappear.</p>
    `,
    image: "https://se-website-images.s3.nl-ams.scw.cloud/teh-tarik.jpg",
    date: "2024-11-20",
    author: "Simply Enak Team",
    categories: ["Culture & Heritage"]
  }
];

// Helper function to get stories by category
export function getStoriesByCategory(categorySlug: string): Story[] {
  return stories.filter(story =>
    story.categories.some(cat => {
      const category = storyCategories.find(c => c.name === cat);
      return category?.slug === categorySlug;
    })
  );
}

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): StoryCategory | undefined {
  return storyCategories.find(cat => cat.slug === slug);
}
