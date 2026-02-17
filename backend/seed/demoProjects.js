const { query, initializeDatabase } = require('../db-local');
const fs = require('fs');
const path = require('path');

// Read demo projects from file
const projectsFilePath = path.join(__dirname, 'electronics_projects.json');
const demoProjects = JSON.parse(fs.readFileSync(projectsFilePath, 'utf8'));

// Initialize database connection
const initDb = async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

const seedDemoProjects = async () => {
  try {
    console.log('Seeding demo projects...');
    
    // Initialize database first
    await initDb();
    
    // Clear existing demo projects
    await query(`DELETE FROM projects WHERE is_demo = 1`);
    
    for (const project of demoProjects) {
      try {
        // Insert project
        const projectResult = await query(
          `INSERT INTO projects (title, difficulty, estimated_time, description, is_demo) 
           VALUES (?, ?, ?, ?, ?)`,
          [project.title, project.difficulty, project.estimated_time, project.description, 1]
        );
        
        const projectId = projectResult.lastID;
        console.log(`Created project: ${project.title} (ID: ${projectId})`);
        
        // Insert steps with proper error handling
        if (project.steps && Array.isArray(project.steps)) {
          for (const step of project.steps) {
            try {
              const components = step.components ? JSON.stringify(step.components) : null;
              await query(
                `INSERT INTO steps (project_id, title, description, components, connections, working, instructions, code, conclusion, order_number, step_number, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  projectId,
                  step.title,
                  step.description || null,
                  components,
                  step.connections || null,
                  step.working || null,
                  step.instructions || null,
                  step.code || null,
                  step.conclusion || null,
                  step.order_number || null,
                  step.step_number || step.order_number || 1,
                  'not_started'
                ]
              );
            } catch (stepError) {
              console.error(`Error inserting step for project ${projectId}:`, stepError);
              throw stepError;
            }
          }
          console.log(`  ✓ Inserted ${project.steps.length} steps`);
        } else {
          console.log(`  ⚠ No steps found for project: ${project.title}`);
        }
        
        console.log(`✓ Seeded project: ${project.title}`);
      } catch (projectError) {
        console.error(`Error seeding project ${project.title}:`, projectError);
        throw projectError;
      }
    }
    
    console.log('✅ All demo projects seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding demo projects:', error);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDemoProjects().then(() => {
    console.log('Demo projects seeding completed successfully');
    process.exit(0);
  }).catch((error) => {
    console.error('Demo projects seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedDemoProjects, demoProjects };