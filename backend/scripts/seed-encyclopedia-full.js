// backend/scripts/seed-encyclopedia-full.js
require('dotenv').config()
const connectDB = require('../config/db')
const Encyclopedia = require('../models/Encyclopedia')
const User = require('../models/User')
const slugify = require('slugify')

async function run() {
  await connectDB()
  console.log('🌱 Seeding full encyclopedia entries...')

  const author = await User.findOne({ email: 'admin@beanie.local' }) || await User.findOne()
  if (!author) {
    console.error('No admin user found. Run seed-users.js first.')
    process.exit(1)
  }

  const entries = [
    // 🗺️ ORIGIN
    {
      title: 'Ethiopia — The Birthplace of Coffee',
      summary: 'Tracing the genetic roots, terroir and diversity of Ethiopian coffee.',
      body: `
        <h2>Overview</h2>
        <p>Ethiopia is widely considered the birthplace of <em>Coffea arabica</em>. Its diverse microclimates and heirloom varietals produce some of the most aromatic and complex coffees in the world.</p>

        <h2>Major Regions</h2>
        <ul>
          <li><strong>Yirgacheffe</strong> — known for floral and tea-like notes with citrus brightness.</li>
          <li><strong>Sidamo</strong> — fruity and balanced, often with berry sweetness.</li>
          <li><strong>Guji</strong> — rich body, honey sweetness, and vibrant acidity.</li>
          <li><strong>Limu</strong> — delicate, mild, and well-rounded with low bitterness.</li>
        </ul>

        <h2>Processing Methods</h2>
        <p>Traditionally, both washed and natural processes are used. Washed Yirgacheffes tend to exhibit clarity and jasmine florals, while natural Sidamos bring heavy berry sweetness.</p>

        <h2>Did You Know?</h2>
        <p>Over 10,000 unique genetic coffee varieties grow naturally in Ethiopia — more than anywhere else in the world.</p>

        <h2>Flavor Profile</h2>
        <ul>
          <li><strong>Aroma:</strong> Floral, bergamot, jasmine</li>
          <li><strong>Flavor:</strong> Citrus, stone fruit, honey</li>
          <li><strong>Body:</strong> Light to medium</li>
          <li><strong>Acidity:</strong> Bright, lemon-like</li>
        </ul>

        <p>For a deeper dive, explore the <a href="/encyclopedia/yirgacheffe">Yirgacheffe</a> entry.</p>
      `,
      tags: ['ethiopia','origin','arabica'],
      type: 'origin'
    },

    // 🧪 SCIENCE
    {
      title: 'The Maillard Reaction in Coffee Roasting',
      summary: 'Understanding how sugars and amino acids create flavor and color during roasting.',
      body: `
        <h2>What is the Maillard Reaction?</h2>
        <p>The Maillard reaction is a complex series of chemical reactions between sugars and amino acids that occur when coffee is roasted. It begins around 150°C (302°F) and contributes to browning, aroma development, and flavor complexity.</p>

        <h2>Stages in Roasting</h2>
        <ol>
          <li><strong>Drying Phase:</strong> Moisture evaporates, preparing beans for chemical change.</li>
          <li><strong>Maillard Phase:</strong> Sugars react with amino acids, forming hundreds of aromatic compounds.</li>
          <li><strong>Development Phase:</strong> Caramelization and pyrolysis deepen sweetness and body.</li>
        </ol>

        <h2>Why It Matters</h2>
        <p>Proper control of this reaction determines the balance between sweetness and bitterness. Too short a Maillard phase leads to grassy flavors; too long can cause flatness or dryness.</p>

        <h2>In the Cup</h2>
        <ul>
          <li>Enhanced body and caramel sweetness</li>
          <li>Reduced sharp acidity</li>
          <li>Complex aromatic depth (nuts, chocolate, toasted sugar)</li>
        </ul>

        <h2>Pro Tip</h2>
        <p>Experienced roasters often lengthen the Maillard phase slightly in lighter roasts to build sweetness without sacrificing brightness.</p>
      `,
      tags: ['science','roasting','chemistry'],
      type: 'science'
    },

    // ☕ BREW METHOD
    {
      title: 'Pour Over — Mastering the V60 Technique',
      summary: 'A detailed guide to achieving clarity and balance in manual brewing.',
      body: `
        <h2>Overview</h2>
        <p>The Hario V60 is a conical dripper designed for even extraction and high clarity. Its spiral ribs and large single hole allow you to precisely control flow rate and contact time.</p>

        <h2>Recommended Recipe</h2>
        <ul>
          <li><strong>Ratio:</strong> 15g coffee : 250g water</li>
          <li><strong>Grind:</strong> Medium-fine (slightly finer than Kalita)</li>
          <li><strong>Water Temperature:</strong> 92–94°C</li>
          <li><strong>Total Brew Time:</strong> 2:30–3:00 minutes</li>
        </ul>

        <h2>Brewing Steps</h2>
        <ol>
          <li>Rinse paper filter with hot water.</li>
          <li>Add ground coffee, flatten the bed.</li>
          <li>Bloom with 45g water for 30 seconds.</li>
          <li>Continue pouring in slow spirals until 250g total water is reached by 2:30.</li>
        </ol>

        <h2>Troubleshooting</h2>
        <ul>
          <li><strong>Sour cup:</strong> Grind finer or increase water temperature.</li>
          <li><strong>Bitter cup:</strong> Grind coarser or reduce brew time.</li>
          <li><strong>Weak body:</strong> Increase ratio to 1:15 or 1:14.</li>
        </ul>

        <h2>Flavor Expectation</h2>
        <p>Expect a bright, tea-like body with high clarity and layered acidity — perfect for highlighting delicate origins like Ethiopia or Kenya.</p>
      `,
      tags: ['brew','pour over','v60'],
      type: 'method'
    },

    // ⚙️ EQUIPMENT
    {
      title: 'Burr Grinders — Why Consistency Matters',
      summary: 'Understanding how grind uniformity impacts extraction and flavor.',
      body: `
        <h2>Blade vs Burr</h2>
        <p>Blade grinders chop coffee unevenly, creating both dust and boulders that extract inconsistently. Burr grinders crush beans between rotating surfaces, resulting in uniform particle size and predictable extraction.</p>

        <h2>Types of Burrs</h2>
        <ul>
          <li><strong>Flat Burrs:</strong> Consistent grind, used in commercial espresso grinders.</li>
          <li><strong>Conical Burrs:</strong> Quieter, less heat buildup, often found in home grinders.</li>
        </ul>

        <h2>Why Consistency Matters</h2>
        <p>Uneven grind size leads to over- and under-extracted flavors coexisting in one cup — sourness from large particles, bitterness from fines. Uniformity ensures balanced sweetness and clarity.</p>

        <h2>Pro Tip</h2>
        <p>Always grind fresh. Even a 15-minute delay allows aromatic compounds to dissipate significantly.</p>
      `,
      tags: ['grinder','equipment','brew'],
      type: 'equipment'
    },

    // 🌍 ORIGIN 2
    {
      title: 'Colombia — Balanced Perfection',
      summary: 'Why Colombian coffee remains a global benchmark for balance and consistency.',
      body: `
        <h2>Overview</h2>
        <p>Colombia's geography — with its Andes mountain ranges, high altitudes, and tropical climate — provides ideal coffee-growing conditions. Smallholder farms dominate, and the National Federation of Coffee Growers ensures traceability and quality control.</p>

        <h2>Flavor Profile</h2>
        <ul>
          <li><strong>Acidity:</strong> Bright, malic (green apple)</li>
          <li><strong>Body:</strong> Medium, velvety</li>
          <li><strong>Flavor:</strong> Chocolate, caramel, red fruit</li>
        </ul>

        <h2>Processing</h2>
        <p>Most Colombian coffees are fully washed, contributing to their clean and balanced profile. Innovations like honey and anaerobic processes are becoming popular for microlots.</p>

        <h2>Did You Know?</h2>
        <p>Colombia was the first country to launch a national coffee brand — Juan Valdez — representing its farmers globally.</p>
      `,
      tags: ['colombia','origin','arabica'],
      type: 'origin'
    }
  ]

  for (const e of entries) {
    const slug = slugify(e.title, { lower: true, strict: true }).slice(0,200)
    const exists = await Encyclopedia.findOne({ slug })
    if (exists) { console.log(`⚠️  Skipping ${e.title}`); continue }
    const doc = new Encyclopedia({
      title: e.title,
      slug,
      summary: e.summary,
      body: e.body,
      tags: e.tags,
      type: e.type,
      author: author._id
    })
    await doc.save()
    console.log(`✅ Inserted ${e.title}`)
  }

  console.log('🎉 Encyclopedia seeding complete.')
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })