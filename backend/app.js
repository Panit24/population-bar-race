require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Initialize Express app
const app = express();
app.use(cors());

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'local_sgn_job_test',
  // password: '',
  port: 5432,
});

// Endpoint to get population data
app.get('/api/population/:year', async (req, res) => {
  try {
    const { year } = req.params;
    // const { rows } = await pool.query(`
    //   SELECT "CountryName", "Year", "Population"
    //   FROM local_population_and_demography
    //   WHERE "Year" BETWEEN 1950 AND 2021s
    //   ORDER BY "Year" ASC
    // `);
    //-------------------------------------------------
    const { rows } = await pool.query(
      `SELECT "CountryName", "Year", "Population"
       FROM local_population_and_demography
       WHERE "Year" = $1
          AND "CountryName" NOT IN (
            'World', 
            'Less developed regions, excluding least developed countries', 
            'Less developed regions, excluding',
            'Less developed regions, excluding China',
            'Less developed regions',
            'Africa (UN)',
            'excluding least developed countries', 
            'Asia (UN)', 
            'Least developed countries',
            'Low-income countries',
            'Latin America and the Caribbean (UN)',
            'Land-locked developing countries (LLDC)',
            'North America (UN)',
            'Northern America (UN)',
            'Africa (UN)',
            'developed regions, excluding China', 
            'Lower-middle-income countries', 
            'Upper-middle-income countries', 
            'More developed regions', 
            'High-income countries', 
            'Europe (UN)'
          )
          AND "CountryName" NOT ILIKE ANY (ARRAY[
            '%excluding%', 
            '%developed%', 
            '%region%', 
            '%(UN)%', 
            '%countries%', 
            '%(LLDC)%'
          ])
       ORDER BY "Population" DESC
       LIMIT 12
    `,
      [year]
    );
    //-------------------------------------------------
    res.json({ rows: rows });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
