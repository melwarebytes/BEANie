// backend/scripts/seed-full-blogs.js
// Adds several full-length blog posts with rich HTML content.
// Usage: node scripts/seed-full-blogs.js

require('dotenv').config()
const connectDB = require('../config/db')
const Article = require('../models/Article')
const User = require('../models/User')
const slugify = require('slugify')

async function run() {
  await connectDB()
  console.log('Seeding full blog posts...')

  // find an author
  let author = await User.findOne({ email: 'admin@beanie.local' })
  if (!author) author = await User.findOne()
  if (!author) {
    console.error('No users found. Run seed-users.js first to create an admin user.')
    process.exit(1)
  }

  const posts = [
    {
      title: 'How to Cup Like a Pro: A Practical Guide',
      excerpt: 'Step-by-step cupping method, scoring tips and vocabulary to sharpen your palate.',
      tags: ['cupping','sensory','tasting'],
      content: `
        <h2>Introduction</h2>
        <p>Cupping is a repeatable method to evaluate coffee quickly and reliably. It helps you compare lots, identify faults, and describe flavours using consistent language.</p>

        <h3>What you need</h3>
        <ul>
          <li>Freshly roasted coffee (same roast date for all samples)</li>
          <li>Grinder (burr is best) set to medium-coarse</li>
          <li>Scale, kettle, spoons, and cupping bowls</li>
        </ul>

        <h3>Step-by-step</h3>
        <ol>
          <li><strong>Prepare</strong> — break samples into uniform grind for each bowl (approx 8.25g/150ml standard).</li>
          <li><strong>Aroma</strong> — smell dry grounds for perfume and varietal notes.</li>
          <li><strong>Pour</strong> — pour ~150ml of 93°C water, covering grounds fully. Wait 3–4 minutes.</li>
          <li><strong>Break crust</strong> — using a spoon, push the crust away while inhaling. Note the aroma and any immediate impressions.</li>
          <li><strong>Remove grounds</strong> — scoop off floating grounds and allow to cool slightly.</li>
          <li><strong>Slurp & score</strong> — use a spoon to slurp aerated coffee; assess acidity, body, sweetness, aftertaste, and balance.</li>
        </ol>

        <h3>Scoring & vocabulary</h3>
        <p>Use consistent scales (e.g. 1–10) for attributes. Common descriptors include citrus, stone fruit, chocolate, caramel, floral, herbal, and so on. Avoid vague terms — be specific.</p>

        <h3>Common mistakes</h3>
        <ul>
          <li>Using inconsistent grind size across samples</li>
          <li>Pouring water at different temperatures</li>
          <li>Not allowing samples to rest before evaluation</li>
        </ul>

        <h3>Conclusion</h3>
        <p>Cupping is a learned skill — practice with a tasting wheel and compare notes with other tasters. Over time, your ability to discern nuance and quality will improve.</p>
      `,
      type: 'blog',
      featured: false
    },

    {
      title: 'Sustainability in Coffee: Practical Steps for Roasters and Buyers',
      excerpt: 'How traceability, long-term contracts and farmer partnerships create better coffee and fairer livelihoods.',
      tags: ['sustainability','origins','ethics'],
      content: `
        <h2>Why sustainability matters</h2>
        <p>Sustainable practices protect ecosystems, secure farmer incomes and improve cup quality. Sustainability is not a marketing buzzword — it requires measurement and long-term commitment.</p>

        <h3>Key pillars</h3>
        <ul>
          <li><strong>Traceability:</strong> Know where beans came from — farm, lot, and processing details.</li>
          <li><strong>Farmer partnerships:</strong> Multi-year contracts & price premiums encourage investments in quality.</li>
          <li><strong>Environmental practices:</strong> Shade trees, water management and soil conservation matter.</li>
        </ul>

        <h3>What buyers can do</h3>
        <ol>
          <li>Buy from trusted exporters who share full lot traceability.</li>
          <li>Pay a living price or premia for documented quality and social programs.</li>
          <li>Support farmer training on post-harvest handling and processing.</li>
        </ol>

        <h3>Roaster responsibilities</h3>
        <p>Roasters should provide transparent pricing, timely payments and honest feedback to producers, which helps lift quality and livelihoods over time.</p>

        <h3>Case study (short)</h3>
        <p>A roastery working directly with a cooperative paid a premia for clean processing. Within two seasons, defect rates dropped and the cooperative secured a higher price on export markets.</p>

        <h3>Conclusion</h3>
        <p>Long-term gains from sustainable trade outweigh short-term cost savings. Build relationships; invest in people and place.</p>
      `,
      type: 'blog',
      featured: true
    },

    {
      title: 'Cold Brew Mastery: Recipes, Scaling and Troubleshooting',
      excerpt: 'A complete guide to making clean, balanced cold brew concentrate and scaling for cafés.',
      tags: ['cold brew','recipe','scale'],
      content: `
        <h2>Cold Brew Basics</h2>
        <p>Cold brew extracts different compounds than hot brew. The method favours sweetness and body, while suppressing bright acidity.</p>

        <h3>Standard concentrate recipe</h3>
        <p><strong>Coffee:</strong> 1 part (by weight) coffee to 4 parts water for concentrate (e.g., 500g coffee : 2L water). Steep 16–20 hours at room temperature or refrigerated.</p>

        <h3>Steps</h3>
        <ol>
          <li>Use a coarse, even grind similar to French press.</li>
          <li>Combine coffee and water in a container; stir to ensure all grounds are wet.</li>
          <li>Cover and steep for 16–20 hours.</li>
          <li>Filter through a fine mesh and paper filter for clarity.</li>
          <li>Store concentrate refrigerated for up to 7–10 days; dilute 1:1 for drinking (adjust to taste).</li>
        </ol>

        <h3>Troubleshooting</h3>
        <ul>
          <li><strong>Muddy/over-extracted taste:</strong> Reduce contact time or use cleaner filtration.</li>
          <li><strong>Sour/under-extracted:</strong> Steep a bit longer or use slightly finer grind.</li>
          <li><strong>Cloudy concentrate:</strong> Double filter or use cold filtration methods.</li>
        </ul>

        <h3>Scaling for service</h3>
        <p>Calculate concentrate needed by estimating servings and desired dilution. Use consistent recipes and label batches with roast date and brew date.</p>

        <h3>Conclusion</h3>
        <p>Cold brew is forgiving but benefits from good water, clean technique, and consistent filtration.</p>
      `,
      type: 'article',
      featured: true
    },

    {
      title: 'Dialing in Espresso: A Practical Workflow',
      excerpt: 'A step-by-step workflow for dialing in espresso and understanding yield, time, and extraction.',
      tags: ['espresso','workflow','tips'],
      content: `
        <h2>Overview</h2>
        <p>Dialing in espresso is iterative: tweak dose, grind, and yield to reach a balanced cup. Keep one variable at a time to isolate effects.</p>

        <h3>Start point</h3>
        <p>Use 18g dose, aim for 36g yield (1:2) and 25–30s extraction as baseline.</p>

        <h3>Workflow</h3>
        <ol>
          <li>Tare and dose — ensure consistent dosing weight.</li>
          <li>Tamp with consistent pressure and distribution.</li>
          <li>Pull a shot and record yield/time and tasting notes.</li>
          <li>If shot is <em>sour</em> — increase extraction (finer grind or longer time).</li>
          <li>If shot is <em>bitter</em> — reduce extraction (coarser grind or shorter time).</li>
        </ol>

        <h3>Common adjustments</h3>
        <ul>
          <li>Adjust grind by small steps (notches) — large moves will overshoot.</li>
          <li>Change dose only if you want to affect body and sweetness.</li>
          <li>Check distribution and puck prep if shots are inconsistent.</li>
        </ul>

        <h3>Notes on yield vs strength</h3>
        <p>Yield affects strength while extraction affects taste balance. Use a refractometer for precise extraction measurements if available.</p>

        <h3>Conclusion</h3>
        <p>Document each change. A consistent workflow and good tools lead to repeatable results.</p>
      `,
      type: 'blog',
      featured: false
    },

    {
      title: 'Home Roasting 101: From Green Bean to Cup',
      excerpt: 'An introduction to home roasting: equipment, roast stages, and keeping records.',
      tags: ['roasting','home roast','process'],
      content: `
        <h2>Why roast at home?</h2>
        <p>Home roasting lets you control roast development and explore flavours — but start with small batches and careful notes.</p>

        <h3>Equipment</h3>
        <p>You can begin with popcorn poppers, dedicated small roasters, or a fluid-bed roaster. Each has different control and learning curves.</p>

        <h3>Roast stages</h3>
        <ol>
          <li><strong>Drying phase:</strong> moisture leaves the bean; colour changes.</li>
          <li><strong>First crack:</strong> audible cracking — marks transition to light roast.</li>
          <li><strong>Development:</strong> after first crack, control time to develop sweetness without burning.</li>
          <li><strong>Second crack (optional):</strong> leads to darker roasts; approach with caution for complexity.</li>
        </ol>

        <h3>Keeping a roast log</h3>
        <p>Record roast time, bean weight, environmental temps, first crack time, and development time. Taste and note the resulting cup.</p>

        <h3>Safety & tips</h3>
        <ul>
          <li>Roasting produces smoke — ensure ventilation.</li>
          <li>Cool beans promptly to stop development.</li>
        </ul>

        <h3>Conclusion</h3>
        <p>Home roasting is a rewarding craft. Start simple and iterate — the roast log is your most valuable tool.</p>
      `,
      type: 'article',
      featured: false
    }
  ]

  for (const p of posts) {
    const slug = slugify(p.title, { lower: true, strict: true }).slice(0,200)
    const exists = await Article.findOne({ slug })
    if (exists) {
      console.log(`Skipping existing post: ${p.title}`)
      continue
    }
    const article = new Article({
      title: p.title,
      slug,
      excerpt: p.excerpt,
      content: p.content,
      tags: p.tags,
      type: p.type || 'blog',
      featured: !!p.featured,
      author: author._id
    })
    await article.save()
    console.log(`Inserted: ${p.title}`)
  }

  console.log('Full blog seed complete.')
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })