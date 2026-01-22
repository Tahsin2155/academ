import { initDatabase, run, exec } from './db/init.js';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  // Initialize database
  await initDatabase();

  // Clear existing data
  exec('DELETE FROM resources');
  exec('DELETE FROM edges');
  exec('DELETE FROM nodes');
  exec('DELETE FROM chapters');
  exec('DELETE FROM subjects');
  exec('DELETE FROM classes');

  console.log('🗑️  Cleared existing data');

  // Seed Classes
  const classes = [
    { id: uuidv4(), name: 'Grade 9', description: 'Foundation year for high school curriculum', order_index: 0 },
    { id: uuidv4(), name: 'Grade 10', description: 'Secondary school curriculum with board exam preparation', order_index: 1 },
    { id: uuidv4(), name: 'Grade 11', description: 'Senior secondary - Science/Commerce/Arts streams', order_index: 2 },
    { id: uuidv4(), name: 'Grade 12', description: 'Final year with board examination focus', order_index: 3 }
  ];

  for (const c of classes) {
    run('INSERT INTO classes (id, name, description, order_index) VALUES (?, ?, ?, ?)', [c.id, c.name, c.description, c.order_index]);
  }
  console.log('✅ Seeded classes');

  // Seed Subjects for Grade 10
  const grade10 = classes.find(c => c.name === 'Grade 10');
  const subjects = [
    { id: uuidv4(), class_id: grade10.id, name: 'Mathematics', description: 'Algebra, Geometry, Trigonometry, Statistics', icon: '📐', color: '#3B82F6', order_index: 0 },
    { id: uuidv4(), class_id: grade10.id, name: 'Physics', description: 'Mechanics, Optics, Electricity, Magnetism', icon: '⚡', color: '#8B5CF6', order_index: 1 },
    { id: uuidv4(), class_id: grade10.id, name: 'Chemistry', description: 'Organic, Inorganic, Physical Chemistry', icon: '🧪', color: '#10B981', order_index: 2 },
    { id: uuidv4(), class_id: grade10.id, name: 'Biology', description: 'Life processes, Genetics, Ecology', icon: '🧬', color: '#F59E0B', order_index: 3 },
    { id: uuidv4(), class_id: grade10.id, name: 'English', description: 'Literature, Grammar, Writing', icon: '📚', color: '#EF4444', order_index: 4 }
  ];

  for (const s of subjects) {
    run('INSERT INTO subjects (id, class_id, name, description, icon, color, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [s.id, s.class_id, s.name, s.description, s.icon, s.color, s.order_index]);
  }
  console.log('✅ Seeded subjects');

  // Seed Chapters for Mathematics
  const mathSubject = subjects.find(s => s.name === 'Mathematics');
  const mathChapters = [
    { id: uuidv4(), subject_id: mathSubject.id, name: 'Real Numbers', description: 'Fundamental theorem of arithmetic, Irrational numbers, Decimal expansion', order_index: 0 },
    { id: uuidv4(), subject_id: mathSubject.id, name: 'Polynomials', description: 'Zeros of polynomials, Relationship between zeros and coefficients', order_index: 1 },
    { id: uuidv4(), subject_id: mathSubject.id, name: 'Linear Equations', description: 'Pair of linear equations in two variables', order_index: 2 },
    { id: uuidv4(), subject_id: mathSubject.id, name: 'Quadratic Equations', description: 'Solution methods, Nature of roots, Applications', order_index: 3 },
    { id: uuidv4(), subject_id: mathSubject.id, name: 'Arithmetic Progressions', description: 'nth term, Sum of n terms, Applications', order_index: 4 },
    { id: uuidv4(), subject_id: mathSubject.id, name: 'Triangles', description: 'Similarity, Criteria for similarity, Area of similar triangles', order_index: 5 },
    { id: uuidv4(), subject_id: mathSubject.id, name: 'Coordinate Geometry', description: 'Distance formula, Section formula, Area of triangle', order_index: 6 },
    { id: uuidv4(), subject_id: mathSubject.id, name: 'Trigonometry', description: 'Trigonometric ratios, Identities, Heights and distances', order_index: 7 }
  ];

  for (const ch of mathChapters) {
    run('INSERT INTO chapters (id, subject_id, name, description, order_index) VALUES (?, ?, ?, ?, ?)', 
      [ch.id, ch.subject_id, ch.name, ch.description, ch.order_index]);
  }
  console.log('✅ Seeded chapters');

  // Seed detailed roadmap for "Quadratic Equations" chapter
  const quadraticChapter = mathChapters.find(ch => ch.name === 'Quadratic Equations');

  const nodes = [
    { id: uuidv4(), chapter_id: quadraticChapter.id, parent_id: null, title: 'Introduction to Quadratic Equations', description: 'Understanding the basic form ax² + bx + c = 0', content: '# What is a Quadratic Equation?\n\nA quadratic equation is a polynomial equation of degree 2. The general form is:\n\n**ax² + bx + c = 0**\n\nwhere:\n- a, b, c are constants (a ≠ 0)\n- x is the variable\n- a is the coefficient of x²\n- b is the coefficient of x\n- c is the constant term\n\n## Examples\n1. x² + 5x + 6 = 0\n2. 2x² - 3x - 2 = 0\n3. x² - 9 = 0', position_x: 400, position_y: 50, node_type: 'concept', order_index: 0 },
    
    { id: uuidv4(), chapter_id: quadraticChapter.id, parent_id: null, title: 'Factorization Method', description: 'Solving by splitting the middle term', content: '# Factorization Method\n\nThis method involves expressing the quadratic as a product of two linear factors.\n\n## Steps:\n1. Write the equation in standard form\n2. Find two numbers whose product = ac and sum = b\n3. Split the middle term using these numbers\n4. Factor by grouping\n5. Solve for x\n\n## Example\nSolve: x² + 5x + 6 = 0\n\nStep 1: Find numbers with product 6 and sum 5 → 2 and 3\nStep 2: x² + 2x + 3x + 6 = 0\nStep 3: x(x + 2) + 3(x + 2) = 0\nStep 4: (x + 2)(x + 3) = 0\nStep 5: x = -2 or x = -3', position_x: 200, position_y: 200, node_type: 'concept', order_index: 1 },
    
    { id: uuidv4(), chapter_id: quadraticChapter.id, parent_id: null, title: 'Completing the Square', description: 'Transform equation to perfect square form', content: '# Completing the Square\n\nThis method converts the quadratic into a perfect square form.\n\n## Steps:\n1. Move constant term to RHS\n2. Divide by coefficient of x² (if not 1)\n3. Add (b/2)² to both sides\n4. Write LHS as perfect square\n5. Take square root and solve\n\n## Example\nSolve: x² + 6x + 5 = 0\n\nStep 1: x² + 6x = -5\nStep 2: x² + 6x + 9 = -5 + 9\nStep 3: (x + 3)² = 4\nStep 4: x + 3 = ±2\nStep 5: x = -1 or x = -5', position_x: 400, position_y: 200, node_type: 'concept', order_index: 2 },
    
    { id: uuidv4(), chapter_id: quadraticChapter.id, parent_id: null, title: 'Quadratic Formula', description: 'Universal formula for solving any quadratic', content: '# Quadratic Formula\n\nThe most powerful method that works for ALL quadratic equations.\n\n## Formula\n\n**x = (-b ± √(b² - 4ac)) / 2a**\n\n## Derivation\nStarting from ax² + bx + c = 0, using completing the square method.\n\n## Example\nSolve: 2x² - 7x + 3 = 0\n\na = 2, b = -7, c = 3\n\nx = (7 ± √(49 - 24)) / 4\nx = (7 ± √25) / 4\nx = (7 ± 5) / 4\n\nx = 3 or x = 0.5', position_x: 600, position_y: 200, node_type: 'concept', order_index: 3 },
    
    { id: uuidv4(), chapter_id: quadraticChapter.id, parent_id: null, title: 'Discriminant', description: 'Analyzing the nature of roots using b² - 4ac', content: '# The Discriminant\n\nThe discriminant D = b² - 4ac determines the nature of roots.\n\n## Cases:\n\n### D > 0 (Positive)\n- Two distinct real roots\n- Roots are rational if D is a perfect square\n\n### D = 0 (Zero)\n- Two equal real roots (repeated root)\n- x = -b/2a\n\n### D < 0 (Negative)\n- No real roots\n- Two complex conjugate roots\n\n## Example\nFor x² - 4x + 4 = 0:\nD = 16 - 16 = 0\n→ Two equal roots: x = 2', position_x: 400, position_y: 350, node_type: 'concept', order_index: 4 },
    
    { id: uuidv4(), chapter_id: quadraticChapter.id, parent_id: null, title: 'Word Problems', description: 'Real-world applications of quadratic equations', content: '# Applications of Quadratic Equations\n\n## Common Types:\n\n### 1. Number Problems\nFind two numbers whose sum is 15 and product is 56.\n\n### 2. Age Problems\nThe product of ages of A and B is 240. If A is 4 years older than B, find their ages.\n\n### 3. Geometry Problems\nThe area of a rectangle is 60 sq.m. Length is 4m more than width. Find dimensions.\n\n### 4. Motion Problems\nA train covers 480 km at uniform speed. If speed increased by 8 km/h, time reduces by 2 hours.\n\n### 5. Work Problems\nTwo pipes can fill a tank. Together they take 6 hours. Alone, one takes 5 hours more than the other.', position_x: 400, position_y: 500, node_type: 'application', order_index: 5 },
    
    { id: uuidv4(), chapter_id: quadraticChapter.id, parent_id: null, title: 'Practice & Assessment', description: 'Test your understanding with exercises', content: '# Practice Problems\n\n## Level 1 - Basic\n1. Solve: x² - 5x + 6 = 0\n2. Solve: x² - 9 = 0\n3. Find discriminant of 2x² + 3x - 5 = 0\n\n## Level 2 - Intermediate\n4. Solve by completing square: x² - 6x + 8 = 0\n5. For what value of k, x² + kx + 9 = 0 has equal roots?\n\n## Level 3 - Advanced\n6. Sum of a number and its reciprocal is 10/3. Find the number.\n7. A train travels 300km at uniform speed. Had speed been 5km/h more, it would have taken 2 hours less. Find original speed.', position_x: 400, position_y: 650, node_type: 'exercise', order_index: 6 }
  ];

  for (const n of nodes) {
    run('INSERT INTO nodes (id, chapter_id, parent_id, title, description, content, position_x, position_y, node_type, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [n.id, n.chapter_id, n.parent_id, n.title, n.description, n.content, n.position_x, n.position_y, n.node_type, n.order_index]);
  }
  console.log('✅ Seeded nodes');

  // Create edges connecting the nodes
  const edges = [
    { chapter_id: quadraticChapter.id, source_id: nodes[0].id, target_id: nodes[1].id, edge_type: 'default' },
    { chapter_id: quadraticChapter.id, source_id: nodes[0].id, target_id: nodes[2].id, edge_type: 'default' },
    { chapter_id: quadraticChapter.id, source_id: nodes[0].id, target_id: nodes[3].id, edge_type: 'default' },
    { chapter_id: quadraticChapter.id, source_id: nodes[1].id, target_id: nodes[4].id, edge_type: 'default' },
    { chapter_id: quadraticChapter.id, source_id: nodes[2].id, target_id: nodes[4].id, edge_type: 'default' },
    { chapter_id: quadraticChapter.id, source_id: nodes[3].id, target_id: nodes[4].id, edge_type: 'default' },
    { chapter_id: quadraticChapter.id, source_id: nodes[4].id, target_id: nodes[5].id, edge_type: 'default' },
    { chapter_id: quadraticChapter.id, source_id: nodes[5].id, target_id: nodes[6].id, edge_type: 'default' }
  ];

  for (const e of edges) {
    run('INSERT INTO edges (id, chapter_id, source_id, target_id, edge_type) VALUES (?, ?, ?, ?, ?)', 
      [uuidv4(), e.chapter_id, e.source_id, e.target_id, e.edge_type]);
  }
  console.log('✅ Seeded edges');

  // Add resources to nodes
  const resources = [
    { node_id: nodes[0].id, type: 'video', title: 'Introduction to Quadratic Equations', url: 'https://www.youtube.com/watch?v=example1', description: 'Visual introduction to quadratic equations' },
    { node_id: nodes[0].id, type: 'article', title: 'Khan Academy - Quadratics', url: 'https://www.khanacademy.org/math/algebra/quadratics', description: 'Comprehensive guide on quadratics' },
    { node_id: nodes[1].id, type: 'video', title: 'Factorization Technique', url: 'https://www.youtube.com/watch?v=example2', description: 'Step-by-step factorization tutorial' },
    { node_id: nodes[1].id, type: 'exercise', title: 'Practice Factorization', url: 'https://www.khanacademy.org/math/algebra/factoring', description: 'Interactive exercises' },
    { node_id: nodes[3].id, type: 'video', title: 'Deriving the Quadratic Formula', url: 'https://www.youtube.com/watch?v=example3', description: 'Understanding where the formula comes from' },
    { node_id: nodes[3].id, type: 'article', title: 'Quadratic Formula Examples', url: 'https://mathsisfun.com/quadratic-formula', description: 'Worked examples' },
    { node_id: nodes[3].id, type: 'exercise', title: 'Quadratic Formula Practice', url: 'https://www.ixl.com/math/quadratic', description: 'Practice problems' },
    { node_id: nodes[5].id, type: 'pdf', title: 'Word Problems Worksheet', url: 'https://example.com/worksheet.pdf', description: 'Printable practice worksheet' },
    { node_id: nodes[5].id, type: 'video', title: 'Solving Word Problems', url: 'https://www.youtube.com/watch?v=example4', description: 'Strategy for approaching word problems' },
    { node_id: nodes[6].id, type: 'exercise', title: 'Chapter Test', url: 'https://example.com/test', description: 'Full chapter assessment' },
    { node_id: nodes[6].id, type: 'pdf', title: 'Previous Year Questions', url: 'https://example.com/pyq.pdf', description: 'Board exam questions' }
  ];

  for (let i = 0; i < resources.length; i++) {
    const r = resources[i];
    run('INSERT INTO resources (id, node_id, type, title, url, description, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [uuidv4(), r.node_id, r.type, r.title, r.url, r.description, i]);
  }
  console.log('✅ Seeded resources');

  // Add Physics chapters
  const physicsSubject = subjects.find(s => s.name === 'Physics');
  const physicsChapters = [
    { id: uuidv4(), subject_id: physicsSubject.id, name: 'Light - Reflection and Refraction', description: 'Laws of reflection, Mirrors, Lenses, Human eye', order_index: 0 },
    { id: uuidv4(), subject_id: physicsSubject.id, name: 'Electricity', description: 'Electric current, Ohm\'s law, Resistance, Circuits', order_index: 1 },
    { id: uuidv4(), subject_id: physicsSubject.id, name: 'Magnetic Effects of Current', description: 'Magnetic field, Electromagnetic induction, Motors', order_index: 2 }
  ];

  for (const ch of physicsChapters) {
    run('INSERT INTO chapters (id, subject_id, name, description, order_index) VALUES (?, ?, ?, ?, ?)', 
      [ch.id, ch.subject_id, ch.name, ch.description, ch.order_index]);
  }

  // Add basic roadmap for Electricity chapter
  const electricityChapter = physicsChapters.find(ch => ch.name === 'Electricity');
  const electricityNodes = [
    { id: uuidv4(), chapter_id: electricityChapter.id, title: 'Electric Current', description: 'Flow of electric charge', content: '# Electric Current\n\nElectric current is the rate of flow of electric charge through a conductor.\n\n**I = Q/t**\n\nUnit: Ampere (A)', position_x: 400, position_y: 50, node_type: 'concept', order_index: 0 },
    { id: uuidv4(), chapter_id: electricityChapter.id, title: 'Electric Potential', description: 'Work done per unit charge', content: '# Electric Potential Difference\n\nThe work done to move a unit charge from one point to another.\n\n**V = W/Q**\n\nUnit: Volt (V)', position_x: 200, position_y: 150, node_type: 'concept', order_index: 1 },
    { id: uuidv4(), chapter_id: electricityChapter.id, title: 'Ohm\'s Law', description: 'V = IR relationship', content: '# Ohm\'s Law\n\nThe current through a conductor is directly proportional to the potential difference across it.\n\n**V = I × R**\n\nwhere R is the resistance in Ohms (Ω)', position_x: 400, position_y: 150, node_type: 'concept', order_index: 2 },
    { id: uuidv4(), chapter_id: electricityChapter.id, title: 'Resistance', description: 'Opposition to current flow', content: '# Resistance\n\nResistance depends on:\n- Length (l)\n- Cross-sectional area (A)\n- Material (resistivity ρ)\n\n**R = ρl/A**', position_x: 600, position_y: 150, node_type: 'concept', order_index: 3 },
    { id: uuidv4(), chapter_id: electricityChapter.id, title: 'Series & Parallel Circuits', description: 'Combination of resistors', content: '# Resistor Combinations\n\n## Series\nR_total = R1 + R2 + R3 + ...\n\n## Parallel\n1/R_total = 1/R1 + 1/R2 + 1/R3 + ...', position_x: 400, position_y: 300, node_type: 'concept', order_index: 4 },
    { id: uuidv4(), chapter_id: electricityChapter.id, title: 'Electric Power', description: 'P = VI, Heating effects', content: '# Electric Power\n\n**P = V × I = I²R = V²/R**\n\nUnit: Watt (W)\n\n## Heating Effect\nH = I²Rt (Joule\'s Law)', position_x: 400, position_y: 450, node_type: 'concept', order_index: 5 }
  ];

  for (const n of electricityNodes) {
    run('INSERT INTO nodes (id, chapter_id, parent_id, title, description, content, position_x, position_y, node_type, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [n.id, n.chapter_id, null, n.title, n.description, n.content, n.position_x, n.position_y, n.node_type, n.order_index]);
  }

  const electricityEdges = [
    { chapter_id: electricityChapter.id, source_id: electricityNodes[0].id, target_id: electricityNodes[1].id },
    { chapter_id: electricityChapter.id, source_id: electricityNodes[0].id, target_id: electricityNodes[2].id },
    { chapter_id: electricityChapter.id, source_id: electricityNodes[0].id, target_id: electricityNodes[3].id },
    { chapter_id: electricityChapter.id, source_id: electricityNodes[2].id, target_id: electricityNodes[4].id },
    { chapter_id: electricityChapter.id, source_id: electricityNodes[3].id, target_id: electricityNodes[4].id },
    { chapter_id: electricityChapter.id, source_id: electricityNodes[4].id, target_id: electricityNodes[5].id }
  ];

  for (const e of electricityEdges) {
    run('INSERT INTO edges (id, chapter_id, source_id, target_id, edge_type) VALUES (?, ?, ?, ?, ?)', 
      [uuidv4(), e.chapter_id, e.source_id, e.target_id, 'default']);
  }

  console.log('✅ Seeded Physics chapters and roadmaps');
  console.log('\n🎉 Database seeding completed successfully!');
  console.log(`\nSummary:`);
  console.log(`- Classes: ${classes.length}`);
  console.log(`- Subjects: ${subjects.length}`);
  console.log(`- Chapters: ${mathChapters.length + physicsChapters.length}`);
  console.log(`- Nodes: ${nodes.length + electricityNodes.length}`);
  console.log(`- Resources: ${resources.length}`);
}

seed().catch(console.error);
