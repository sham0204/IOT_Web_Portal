const { query, initializeDatabase } = require('./db-local');
const bcrypt = require('bcrypt');

const seedDemoData = async () => {
  try {
    console.log('Initializing database...');
    await initializeDatabase();

    // Create a demo user if one doesn't exist
    const demoUserResult = await query(
      'SELECT id FROM users WHERE email = ?', 
      ['demo@smartdrishti.com']
    );

    let demoUserId;
    if (demoUserResult.rows.length === 0) {
      // Hash password
      const passwordHash = await bcrypt.hash('demopassword123', 10);
      
      // Create demo user
      const createUserResult = await query(
        `INSERT INTO users (username, email, password_hash, role) 
         VALUES (?, ?, ?, ?)`,
        ['Demo User', 'demo@smartdrishti.com', passwordHash, 'user']
      );
      
      // Get the user we just created
      const newUserResult = await query(
        'SELECT id FROM users WHERE email = ?', 
        ['demo@smartdrishti.com']
      );
      demoUserId = newUserResult.rows[0].id;
      
      console.log('Created demo user');
    } else {
      demoUserId = demoUserResult.rows[0].id;
      console.log('Found existing demo user');
    }

    // Create some demo projects if they don't exist
    const existingProjects = await query(
      'SELECT title FROM projects WHERE user_id = ?',
      [demoUserId]
    );

    const existingTitles = existingProjects.rows.map(p => p.title);

    const demoProjects = [
      {
        title: "Getting Started with ESP32",
        difficulty: "Easy",
        estimated_time: "2-3 hours",
        description: "Learn the basics of ESP32 microcontroller programming and setup",
        steps: [
          { title: "Unboxing ESP32", description: "Identify ESP32 components and features", status: "not_started" },
          { title: "Install Arduino IDE", description: "Download and configure Arduino IDE for ESP32", status: "not_started" },
          { title: "First Blink Program", description: "Flash your first LED blink program", status: "not_started" },
          { title: "GPIO Control", description: "Control digital pins and sensors", status: "not_started" }
        ]
      },
      {
        title: "Temperature Monitoring System",
        difficulty: "Medium",
        estimated_time: "4-5 hours",
        description: "Build a complete IoT temperature monitoring system with cloud connectivity",
        steps: [
          { title: "Hardware Setup", description: "Connect DHT22 sensor to ESP32", status: "not_started" },
          { title: "WiFi Connection", description: "Configure WiFi credentials", status: "not_started" },
          { title: "Sensor Reading", description: "Read temperature and humidity data", status: "not_started" },
          { title: "Cloud Upload", description: "Send data to ThingSpeak cloud service", status: "not_started" },
          { title: "Dashboard Creation", description: "Visualize data on a web dashboard", status: "not_started" }
        ]
      },
      {
        title: "Smart Home Automation",
        difficulty: "Hard",
        estimated_time: "6-8 hours",
        description: "Create a complete home automation system with multiple sensors and actuators",
        steps: [
          { title: "System Design", description: "Plan hardware and software architecture", status: "not_started" },
          { title: "Multiple Sensors", description: "Connect temperature, light, and motion sensors", status: "not_started" },
          { title: "Relay Control", description: "Control lights and appliances", status: "not_started" },
          { title: "Mobile Interface", description: "Create mobile app for control", status: "not_started" },
          { title: "Voice Control", description: "Integrate with voice assistants", status: "not_started" },
          { title: "Security Implementation", description: "Add authentication and encryption", status: "not_started" }
        ]
      }
    ];

    for (const project of demoProjects) {
      if (!existingTitles.includes(project.title)) {
        // Insert project
        const projectResult = await query(
          `INSERT INTO projects (user_id, title, difficulty, estimated_time, description) 
           VALUES (?, ?, ?, ?, ?)`,
          [demoUserId, project.title, project.difficulty, project.estimated_time, project.description]
        );

        // Get the project we just inserted
        const newProjectResult = await query('SELECT id FROM projects WHERE title = ?', [project.title]);
        const projectId = newProjectResult.rows[0].id;

        // Insert steps
        for (const step of project.steps) {
          await query(
            `INSERT INTO steps (project_id, title, description, status) 
             VALUES (?, ?, ?, ?)`,
            [projectId, step.title, step.description, step.status]
          );
        }

        console.log(`Created demo project: ${project.title}`);
      } else {
        console.log(`Demo project already exists: ${project.title}`);
      }
    }

    console.log('Demo data seeding completed!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
};

seedDemoData();