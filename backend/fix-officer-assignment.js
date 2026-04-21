// One-time migration: Assign officer to existing beneficiaries that have no officerId
require('dotenv').config();
const mongoose = require('mongoose');
const Beneficiary = require('./models/Beneficiary');
const Officer = require('./models/Officer');

async function fixOfficerAssignment() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all officers
        const officers = await Officer.find();
        console.log(`Found ${officers.length} officer(s):`);
        officers.forEach(o => console.log(`  - ${o.name} (${o.email}) [ID: ${o._id}]`));

        if (officers.length === 0) {
            console.log('No officers found. Cannot assign.');
            process.exit(1);
        }

        // Use the first officer
        const officer = officers[0];
        console.log(`\nUsing officer: ${officer.name} (${officer._id})`);

        // Find all beneficiaries without an officerId
        const unassigned = await Beneficiary.find({ $or: [{ officerId: null }, { officerId: { $exists: false } }] });
        console.log(`Found ${unassigned.length} unassigned beneficiary(ies):`);
        unassigned.forEach(b => console.log(`  - ${b.name}`));

        if (unassigned.length === 0) {
            console.log('All beneficiaries already have an officer assigned!');
            process.exit(0);
        }

        // Update all unassigned beneficiaries
        const result = await Beneficiary.updateMany(
            { $or: [{ officerId: null }, { officerId: { $exists: false } }] },
            { $set: { officerId: officer._id } }
        );

        console.log(`\n✅ Updated ${result.modifiedCount} beneficiary(ies) → assigned to officer "${officer.name}"`);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

fixOfficerAssignment();
