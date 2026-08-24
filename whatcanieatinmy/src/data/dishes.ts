/**
 * Malaysian Dish Database for Dietary Safety Checker
 *
 * Each dish has dietary tags indicating whether it is:
 * - safe for that restriction (true = safe, false = avoid)
 * - conditional ("caution") = depends on preparation / ask vendor
 *
 * Hidden ingredients field documents the common hidden concern
 * for each dish so travelers know what to ask about.
 *
 * This is a linkable asset — the data is the value. Journalists,
 * bloggers, and travel sites can reference it as a definitive guide.
 */

export interface Dish {
  id: string;
  name: string;
  category: string;
  origin: string; // Malay, Chinese, Indian, Nyonya, etc.
  description: string;
  // Dietary safety: 'safe' | 'caution' | 'avoid'
  vegetarian: 'safe' | 'caution' | 'avoid';
  vegan: 'safe' | 'caution' | 'avoid';
  halal: 'safe' | 'caution' | 'avoid';
  glutenFree: 'safe' | 'caution' | 'avoid';
  nutFree: 'safe' | 'caution' | 'avoid';
  shellfishFree: 'safe' | 'caution' | 'avoid';
  dairyFree: 'safe' | 'caution' | 'avoid';
  eggFree: 'safe' | 'caution' | 'avoid';
  hiddenIngredients: string;
  tourSlug?: string; // link to relevant Simply Enak tour
}

export const dishes: Dish[] = [
  // === RICE DISHES ===
  {
    id: 'nasi-lemak',
    name: 'Nasi Lemak',
    category: 'Rice',
    origin: 'Malay',
    description: 'Coconut rice with sambal, peanuts, cucumber, and usually fried chicken or anchovies.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'safe',
    glutenFree: 'caution', // sambal may contain soy sauce
    nutFree: 'avoid', // contains peanuts
    shellfishFree: 'avoid', // dried anchovies (ikan bilis)
    dairyFree: 'safe',
    eggFree: 'caution', // often served with fried egg
    hiddenIngredients: 'Dried anchovies (ikan bilis) in sambal and as garnish. Soy sauce in sambal may contain wheat.',
    tourSlug: 'kuala-lumpur-street-food',
  },
  {
    id: 'nasi-kandar',
    name: 'Nasi Kandar',
    category: 'Rice',
    origin: 'Indian-Muslim',
    description: 'Steamed rice with various curries poured over. A Penang institution.',
    vegetarian: 'caution', // some stalls have vegetarian curries
    vegan: 'avoid',
    halal: 'safe',
    glutenFree: 'caution',
    nutFree: 'caution', // some curries use ground nuts
    shellfishFree: 'avoid', // shrimp paste in many curries
    dairyFree: 'caution', // some curries use ghee or yogurt
    eggFree: 'caution',
    hiddenIngredients: 'Shrimp paste (belacan) in many curries. Cross-contamination is common since ladles touch multiple dishes.',
    tourSlug: 'penang-street-food',
  },
  {
    id: 'banana-leaf-rice',
    name: 'Banana Leaf Rice',
    category: 'Rice',
    origin: 'Indian',
    description: 'Rice served on a banana leaf with vegetable curries, dhal, and sides.',
    vegetarian: 'safe',
    vegan: 'caution', // ghee or yogurt in some curries
    halal: 'caution', // some Indian stalls are not halal-certified
    glutenFree: 'caution', // some curries may use flour thickening
    nutFree: 'caution', // some curries use cashew or groundnut
    shellfishFree: 'caution', // some mixed curries may contain shrimp
    dairyFree: 'caution', // ghee, yogurt, paneer common
    eggFree: 'safe',
    hiddenIngredients: 'Ghee (clarified butter) is widely used in South Indian cooking. Ask if curries are purely vegetable-based.',
    tourSlug: 'kuala-lumpur-street-food',
  },
  {
    id: 'char-kway-teow',
    name: 'Char Kway Teow',
    category: 'Noodles',
    origin: 'Chinese',
    description: 'Stir-fried flat rice noodles with prawns, cockles, Chinese sausage, and bean sprouts.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'avoid', // pork and non-halal ingredients
    glutenFree: 'safe', // rice noodles, but soy sauce contains wheat
    nutFree: 'safe',
    shellfishFree: 'avoid', // prawns, cockles, shrimp paste
    dairyFree: 'safe',
    eggFree: 'caution', // usually contains egg
    hiddenIngredients: 'Pork lard is traditionally used for flavor. Cockles are common. Soy sauce contains wheat unless tamari is used.',
    tourSlug: 'penang-street-food',
  },
  {
    id: 'hokkien-mee',
    name: 'Hokkien Mee (KL style)',
    category: 'Noodles',
    origin: 'Chinese',
    description: 'Thick yellow noodles stir-fried with pork, squid, and cabbage in dark soy sauce.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'avoid',
    glutenFree: 'avoid', // wheat noodles + soy sauce
    nutFree: 'safe',
    shellfishFree: 'avoid', // squid, prawns
    dairyFree: 'safe',
    eggFree: 'caution',
    hiddenIngredients: 'Pork lard, pork cracklings. Dark soy sauce contains wheat. Often includes squid and prawns.',
    tourSlug: 'kuala-lumpur-street-food',
  },
  {
    id: 'laksa-penang',
    name: 'Penang Asam Laksa',
    category: 'Noodles',
    origin: 'Nyonya',
    description: 'Rice noodles in a tangy, spicy fish broth with mackerel, tamarind, and mint.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'caution', // fish-based, but some stalls may not be halal-certified
    glutenFree: 'safe', // rice noodles; check for shrimp paste
    nutFree: 'safe',
    shellfishFree: 'caution', // shrimp paste (belacan) sometimes added
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Shrimp paste (belacan) is often added even in fish-based broth. Mackerel is the main protein.',
    tourSlug: 'penang-street-food',
  },
  {
    id: 'laksa-sarawak',
    name: 'Sarawak Laksa',
    category: 'Noodles',
    origin: 'Sarawak',
    description: 'Rice vermicelli in a spiced coconut gravy with prawns, chicken, and lime.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'caution',
    glutenFree: 'safe', // rice vermicelli
    nutFree: 'safe',
    shellfishFree: 'avoid', // prawns
    dairyFree: 'avoid', // coconut milk
    eggFree: 'caution', // often garnished with egg
    hiddenIngredients: 'Coconut milk is the base. Prawns are essential. Some versions use belacan.',
  },
  {
    id: 'roti-canai',
    name: 'Roti Canai',
    category: 'Bread',
    origin: 'Indian-Muslim',
    description: 'Flaky, buttery flatbread served with dhal or curry. A Malaysian breakfast staple.',
    vegetarian: 'caution', // dough contains ghee/butter
    vegan: 'avoid',
    halal: 'safe',
    glutenFree: 'avoid', // wheat flour
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'avoid', // ghee or margarine in dough
    eggFree: 'safe',
    hiddenIngredients: 'Ghee or margarine is kneaded into the dough. The dhal dipping sauce is usually vegetarian but may contain shrimp paste at some stalls.',
    tourSlug: 'kuala-lumpur-street-food',
  },
  {
    id: 'roti-nasik',
    name: 'Roti Nasik (Bread & Egg)',
    category: 'Bread',
    origin: 'Indian-Muslim',
    description: 'Roti canai with egg, sometimes with onion. Popular morning option.',
    vegetarian: 'caution',
    vegan: 'avoid',
    halal: 'safe',
    glutenFree: 'avoid',
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'avoid',
    eggFree: 'avoid',
    hiddenIngredients: 'Same ghee/margarine as roti canai. Dhal may contain shrimp paste.',
  },
  {
    id: 'satay',
    name: 'Satay',
    category: 'Grilled',
    origin: 'Malay',
    description: 'Skewered, charcoal-grilled meat served with peanut sauce, cucumber, and onion.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'safe', // chicken and beef satay are halal; ask about source
    glutenFree: 'caution', // soy sauce in marinade
    nutFree: 'avoid', // peanut sauce
    shellfishFree: 'safe',
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Peanut sauce is universal. Marinade often contains soy sauce (wheat). Some stalls may sell pork satay — check if halal matters to you.',
    tourSlug: 'kuala-lumpur-street-food',
  },
  {
    id: 'kuih',
    name: 'Kuih (Nyonya Snacks)',
    category: 'Snack',
    origin: 'Nyonya',
    description: 'Colorful bite-sized cakes: ondeh-ondeh, kuih lapis, ang koo kuih, and more.',
    vegetarian: 'caution', // varies by type
    vegan: 'caution', // many use coconut milk
    halal: 'caution', // some Chinese kuih may contain pork or lard
    glutenFree: 'caution', // some use wheat flour
    nutFree: 'caution', // some use peanuts or coconut
    shellfishFree: 'caution', // some savory kuih use shrimp paste
    dairyFree: 'safe', // rarely uses dairy
    eggFree: 'caution', // some use egg
    hiddenIngredients: 'Each kuih type is different. Coconut milk is extremely common. Some savory varieties contain shrimp paste. Ask the vendor what is inside.',
    tourSlug: 'penang-street-food',
  },
  {
    id: 'cendol',
    name: 'Cendol',
    category: 'Dessert',
    origin: 'Malay',
    description: 'Iced coconut milk dessert with green jelly noodles, red beans, and palm sugar.',
    vegetarian: 'safe',
    vegan: 'safe', // traditionally vegan
    halal: 'safe',
    glutenFree: 'safe', // rice flour jelly
    nutFree: 'safe', // coconut is not classified as tree nut in Malaysian context
    shellfishFree: 'safe',
    dairyFree: 'safe', // coconut milk, not dairy
    eggFree: 'safe',
    hiddenIngredients: 'Some modern versions add dairy ice cream on top. Traditional version is fully plant-based. Coconut milk is the base — safe for dairy-free.',
    tourSlug: 'penang-street-food',
  },
  {
    id: 'ais-kacang',
    name: 'Ais Kacang (ABC)',
    category: 'Dessert',
    origin: 'Malay',
    description: 'Shaved ice with red beans, sweet corn, grass jelly, and syrup.',
    vegetarian: 'safe',
    vegan: 'safe',
    halal: 'safe',
    glutenFree: 'safe',
    nutFree: 'caution', // some versions include peanuts
    shellfishFree: 'safe',
    dairyFree: 'caution', // some versions add evaporated milk
    eggFree: 'safe',
    hiddenIngredients: 'Some versions add evaporated milk or ice cream. Some include peanuts. Ask for the classic version without dairy.',
  },
  {
    id: 'durian',
    name: 'Durian',
    category: 'Fruit',
    origin: 'Malay',
    description: 'The king of fruits. Fresh, pungent, creamy. Available during season (May-August).',
    vegetarian: 'safe',
    vegan: 'safe',
    halal: 'safe',
    glutenFree: 'safe',
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Naturally safe for all dietary restrictions. The only concern is durian being served in venues that also serve alcohol — some hotels prohibit durian.',
    tourSlug: 'georgetown-night-food-durian',
  },
  {
    id: 'pulled-tea',
    name: 'Teh Tarik',
    category: 'Drink',
    origin: 'Indian-Muslim',
    description: 'Frothy pulled tea with condensed milk. National drink of Malaysia.',
    vegetarian: 'safe',
    vegan: 'avoid', // condensed milk
    halal: 'safe',
    glutenFree: 'safe',
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'avoid', // condensed milk + evaporated milk
    eggFree: 'safe',
    hiddenIngredients: 'Made with condensed milk and evaporated milk. Ask for "teh O" (black tea with sugar, no milk) for a dairy-free version.',
  },
  {
    id: 'kopi-o',
    name: 'Kopi O',
    category: 'Drink',
    origin: 'Chinese',
    description: 'Black coffee with sugar, served hot or iced. No milk.',
    vegetarian: 'safe',
    vegan: 'safe',
    halal: 'caution', // Chinese kopitiams are not always halal
    glutenFree: 'safe',
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Traditionally no milk. But served in Chinese kopitiams that may also serve pork. Ask for "kopi O peng" for iced version.',
  },
  {
    id: 'wanton-noodles',
    name: 'Wanton Noodles',
    category: 'Noodles',
    origin: 'Chinese',
    description: 'Egg noodles with pork dumplings, char siew, and vegetables.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'avoid', // pork
    glutenFree: 'avoid', // wheat noodles
    nutFree: 'safe',
    shellfishFree: 'caution', // some broths use dried shrimp
    dairyFree: 'safe',
    eggFree: 'avoid', // egg noodles + egg in dumplings
    hiddenIngredients: 'Pork dumplings and char siew (BBQ pork). Broth may contain dried shrimp. Wheat noodles throughout.',
  },
  {
    id: 'hainan-chicken-rice',
    name: 'Hainanese Chicken Rice',
    category: 'Rice',
    origin: 'Chinese',
    description: 'Poached chicken with fragrant rice cooked in chicken fat, served with chili sauce.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'avoid', // often non-halal Chinese stalls
    glutenFree: 'caution', // soy sauce in chili sauce
    nutFree: 'safe',
    shellfishFree: 'caution', // some chili sauces contain shrimp
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Rice is cooked in chicken fat and broth. Chili sauce may contain soy sauce (wheat) and shrimp paste.',
  },
  {
    id: 'popiah',
    name: 'Popiah',
    category: 'Snack',
    origin: 'Nyonya',
    description: 'Fresh spring roll with turnip, bean sprouts, lettuce, and various fillings.',
    vegetarian: 'caution', // some versions contain dried shrimp or meat
    vegan: 'caution',
    halal: 'caution', // depends on filling
    glutenFree: 'avoid', // wheat wrapper
    nutFree: 'safe',
    shellfishFree: 'caution', // dried shrimp common
    dairyFree: 'safe',
    eggFree: 'caution', // some versions include egg
    hiddenIngredients: 'Dried shrimp (heh bee) is a common filling. Some versions contain pork or sausage. The wrapper is wheat-based.',
    tourSlug: 'penang-street-food',
  },
  {
    id: 'roe-chan',
    name: 'Rojak',
    category: 'Snack',
    origin: 'Malay',
    description: 'Fruit and vegetable salad with a thick, sweet-sour-spicy prawn paste dressing.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'safe',
    glutenFree: 'caution', // some paste contains wheat
    nutFree: 'caution', // crushed peanuts common
    shellfishFree: 'avoid', // prawn paste (heh ko) is core ingredient
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Prawn paste (heh ko) is the essential ingredient. Crushed peanuts are usually sprinkled on top.',
  },
  {
    id: 'bean-curd-dessert',
    name: 'Tau Fu Fah',
    category: 'Dessert',
    origin: 'Chinese',
    description: 'Silken tofu pudding in sweet ginger syrup, served hot or cold.',
    vegetarian: 'safe',
    vegan: 'caution', // some versions use dairy milk; traditional is soy-based
    halal: 'caution', // Chinese stalls
    glutenFree: 'safe', // soy + ginger
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'caution', // modern versions sometimes use dairy milk
    eggFree: 'safe',
    hiddenIngredients: 'Traditional version is soy-based and vegan-friendly. Some modern stalls use dairy milk instead of soy. Ask if it is "tau fu fa with soya" or "with milk".',
  },
  {
    id: 'apam-balik',
    name: 'Apam Balik',
    category: 'Snack',
    origin: 'Malay',
    description: 'Crispy folded pancake filled with crushed peanuts and sugar.',
    vegetarian: 'safe',
    vegan: 'caution', // some versions use egg in batter
    halal: 'safe',
    glutenFree: 'avoid', // wheat flour
    nutFree: 'avoid', // peanut filling
    shellfishFree: 'safe',
    dairyFree: 'caution', // some use margarine
    eggFree: 'caution',
    hiddenIngredients: 'Peanut filling is universal. Batter may contain egg. Some vendors use margarine (may contain dairy).',
  },
  {
    id: 'pisang-goreng',
    name: 'Pisang Goreng',
    category: 'Snack',
    origin: 'Malay',
    description: 'Deep-fried banana fritters. Crispy outside, sweet inside.',
    vegetarian: 'safe',
    vegan: 'caution', // some batters use egg
    halal: 'safe',
    glutenFree: 'caution', // batter may use wheat flour
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'caution', // some use margarine
    eggFree: 'caution',
    hiddenIngredients: 'Batter varies — some use egg, some use rice flour only. Wheat flour is common. Ask if batter contains egg.',
  },
  {
    id: 'kaya-toast',
    name: 'Kaya Toast',
    category: 'Breakfast',
    origin: 'Chinese',
    description: 'Toasted bread with kaya (coconut jam) and butter, served with soft-boiled eggs.',
    vegetarian: 'safe',
    vegan: 'avoid', // butter
    halal: 'caution', // Chinese kopitiam
    glutenFree: 'avoid', // wheat bread
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'avoid', // butter
    eggFree: 'avoid', // served with soft-boiled eggs
    hiddenIngredients: 'Kaya is made from coconut, eggs, and sugar. Butter is used generously. Served with soft-boiled eggs.',
  },
  {
    id: 'curry-laksa',
    name: 'Curry Laksa',
    category: 'Noodles',
    origin: 'Nyonya',
    description: 'Noodles in spicy coconut curry soup with tofu puffs, prawns, and cockles.',
    vegetarian: 'caution', // some stalls have vegetarian version
    vegan: 'avoid',
    halal: 'caution',
    glutenFree: 'caution', // depends on noodle type
    nutFree: 'safe',
    shellfishFree: 'avoid', // prawns, cockles, shrimp paste
    dairyFree: 'avoid', // coconut milk
    eggFree: 'caution',
    hiddenIngredients: 'Coconut milk base. Prawns and cockles common. Shrimp paste often in broth. Some versions include chicken or pork.',
  },
  {
    id: 'buddhist-vegetarian',
    name: 'Zhai (Buddhist Vegetarian)',
    category: 'Vegetarian',
    origin: 'Chinese',
    description: 'Mock meat dishes made from soy and mushroom, no onion or garlic.',
    vegetarian: 'safe',
    vegan: 'caution', // some use dairy or egg
    halal: 'caution', // not halal-certified but contains no pork
    glutenFree: 'caution', // mock meats often contain wheat gluten (seitan)
    nutFree: 'caution', // some dishes use cashew or peanut
    shellfishFree: 'safe',
    dairyFree: 'caution',
    eggFree: 'caution',
    hiddenIngredients: 'Mock meats are often wheat gluten (seitan) — not gluten-free. Some dishes use egg or dairy. No onion, garlic, or leek by religious practice.',
    tourSlug: 'kl-vegetarian-food-tour',
  },
  {
    id: 'dosa',
    name: 'Dosai (Thosai)',
    category: 'Bread',
    origin: 'Indian',
    description: 'Crispy fermented rice and lentil crepe, served with chutney and sambar.',
    vegetarian: 'safe',
    vegan: 'safe', // traditionally vegan
    halal: 'caution', // Indian stalls may not be halal-certified
    glutenFree: 'safe', // rice + lentil batter
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'safe', // traditionally no dairy
    eggFree: 'safe',
    hiddenIngredients: 'Traditionally made from rice and lentil batter — naturally vegan and gluten-free. Some stalls may add ghee on top; ask for "no ghee".',
    tourSlug: 'kl-vegetarian-food-tour',
  },
  {
    id: 'idli',
    name: 'Idli',
    category: 'Breakfast',
    origin: 'Indian',
    description: 'Steamed rice and lentil cakes, served with sambar and chutney.',
    vegetarian: 'safe',
    vegan: 'safe',
    halal: 'caution',
    glutenFree: 'safe',
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Made from fermented rice and lentil batter. Naturally vegan, gluten-free, and free of all major allergens. One of the safest Malaysian foods.',
    tourSlug: 'kl-vegetarian-food-tour',
  },
  {
    id: 'thosai-masala',
    name: 'Masala Thosai',
    category: 'Bread',
    origin: 'Indian',
    description: 'Dosai filled with spiced potato masala. Filling and flavorful.',
    vegetarian: 'safe',
    vegan: 'safe',
    halal: 'caution',
    glutenFree: 'safe',
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Potato masala may contain mustard seeds and curry leaves. Same batter as dosai — naturally vegan and gluten-free. Ask for "no ghee".',
    tourSlug: 'kl-vegetarian-food-tour',
  },
  {
    id: 'beef-rendang',
    name: 'Beef Rendang',
    category: 'Curry',
    origin: 'Malay',
    description: 'Slow-cooked beef in coconut milk and spice paste, dry and intensely flavored.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'safe',
    glutenFree: 'caution', // some paste contains soy sauce
    nutFree: 'caution', // some use ground nut
    shellfishFree: 'caution', // some recipes use belacan
    dairyFree: 'avoid', // coconut milk
    eggFree: 'safe',
    hiddenIngredients: 'Coconut milk base. Some recipes include belacan (shrimp paste). Soy sauce may be used in spice paste.',
  },
  {
    id: 'kari-pap',
    name: 'Karipap (Curry Puff)',
    category: 'Snack',
    origin: 'Malay',
    description: 'Deep-fried pastry filled with curried potatoes and sometimes chicken or sardine.',
    vegetarian: 'caution', // potato version can be vegetarian
    vegan: 'caution',
    halal: 'safe',
    glutenFree: 'avoid', // wheat pastry
    nutFree: 'safe',
    shellfishFree: 'caution', // some versions use shrimp
    dairyFree: 'caution',
    eggFree: 'caution',
    hiddenIngredients: 'Pastry is wheat-based. Filling varies — potato, chicken, or sardine. Some curries contain belacan. Ask for potato-only version.',
  },
  {
    id: 'yong-tau-foo',
    name: 'Yong Tau Foo',
    category: 'Soup',
    origin: 'Chinese',
    description: 'Tofu and vegetables stuffed with fish paste, served in broth or dry with sauce.',
    vegetarian: 'avoid', // fish paste filling
    vegan: 'avoid',
    halal: 'caution', // fish-based but Chinese stall
    glutenFree: 'caution', // some sauces contain wheat
    nutFree: 'safe',
    shellfishFree: 'caution', // fish paste may contain shrimp
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Fish paste is the filling — even in tofu and vegetables. Some broths use dried shrimp. Soy-based dipping sauce contains wheat.',
  },
  {
    id: 'cendol-penang',
    name: 'Penang Road Cendol',
    category: 'Dessert',
    origin: 'Nyonya',
    description: 'Penang\'s famous cendol with palm sugar, coconut milk, and red beans.',
    vegetarian: 'safe',
    vegan: 'safe',
    halal: 'safe',
    glutenFree: 'safe',
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Fully plant-based: coconut milk, palm sugar, green jelly (rice flour), red beans. One of the safest desserts for all restrictions.',
    tourSlug: 'penang-street-food',
  },
  {
    id: 'char-siew-rice',
    name: 'Char Siew Rice',
    category: 'Rice',
    origin: 'Chinese',
    description: 'Rice with BBQ pork, vegetables, and sweet dark sauce.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'avoid', // pork
    glutenFree: 'caution', // soy sauce
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Char siew is pork marinated in honey, soy sauce (wheat), and red food coloring. Not halal. Soy sauce throughout.',
  },
  {
    id: 'bao',
    name: 'Pau (Bao)',
    category: 'Snack',
    origin: 'Chinese',
    description: 'Steamed buns with various fillings: pork, chicken, red bean, or kaya.',
    vegetarian: 'caution', // red bean or kaya versions
    vegan: 'caution', // red bean version
    halal: 'caution', // pork versions not halal
    glutenFree: 'avoid', // wheat dough
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'caution',
    eggFree: 'caution',
    hiddenIngredients: 'Dough is wheat-based. Fillings vary: pork (not halal), chicken, red bean (vegetarian), or kaya (contains egg). Ask for "tau sar pau" (red bean bun) for vegetarian.',
  },
  {
    id: 'sup-kambing',
    name: 'Sup Kambing',
    category: 'Soup',
    origin: 'Malay',
    description: 'Spicy mutton soup with spices, herbs, and sometimes bones.',
    vegetarian: 'avoid',
    vegan: 'avoid',
    halal: 'safe',
    glutenFree: 'caution', // some use soy sauce
    nutFree: 'safe',
    shellfishFree: 'safe',
    dairyFree: 'safe',
    eggFree: 'safe',
    hiddenIngredients: 'Mutton bones may be included. Some versions use soy sauce (wheat) for seasoning. Spices are the main flavoring.',
  },
];

export const dietaryRestrictions = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬', description: 'No meat, poultry, or fish' },
  { id: 'vegan', label: 'Vegan', icon: '🌱', description: 'No animal products including dairy and eggs' },
  { id: 'halal', label: 'Halal', icon: '🥩', description: 'No pork, no alcohol, halal-certified only' },
  { id: 'glutenFree', label: 'Gluten-Free', icon: '🌾', description: 'No wheat, barley, or rye' },
  { id: 'nutFree', label: 'Nut-Free', icon: '🥜', description: 'No peanuts or tree nuts' },
  { id: 'shellfishFree', label: 'Shellfish-Free', icon: '🦐', description: 'No shrimp, prawns, crab, or shellfish' },
  { id: 'dairyFree', label: 'Dairy-Free', icon: '🧀', description: 'No milk, cheese, butter, or cream' },
  { id: 'eggFree', label: 'Egg-Free', icon: '🥚', description: 'No eggs or egg products' },
];
