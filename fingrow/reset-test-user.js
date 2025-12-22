#!/usr/bin/env node

/**
 * Reset Test User Script
 * 
 * This script helps you delete a test user so you can test signup again
 * with the same email address. USE ONLY FOR DEVELOPMENT!
 */

const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function resetTestUser() {
  console.log('\n🔄 Reset Test User for Email Testing\n');
  console.log('⚠️  WARNING: This will DELETE a user account from the database!');
  console.log('   Only use this for development/testing purposes.\n');
  
  const email = await question('📧 Enter email address to delete: ');
  
  if (!email) {
    console.log('❌ Email is required');
    rl.close();
    return;
  }
  
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log(`❌ No user found with email: ${email}`);
      rl.close();
      return;
    }
    
    console.log(`\n👤 Found user: ${user.name} (${user.email})`);
    console.log(`   Created: ${user.createdAt}`);
    console.log(`   ID: ${user.id}\n`);
    
    const confirm = await question('❓ Are you sure you want to DELETE this user? (type "DELETE" to confirm): ');
    
    if (confirm !== 'DELETE') {
      console.log('❌ Deletion cancelled');
      rl.close();
      return;
    }
    
    // Delete user and related data
    await prisma.$transaction(async (tx) => {
      // Delete related data first
      await tx.transaction.deleteMany({ where: { userId: user.id } });
      await tx.investmentHistory.deleteMany({ where: { userId: user.id } });
      await tx.aIRule.deleteMany({ where: { userId: user.id } });
      await tx.goal.deleteMany({ where: { userId: user.id } });
      await tx.notification.deleteMany({ where: { userId: user.id } });
      await tx.chatMessage.deleteMany({ where: { userId: user.id } });
      await tx.streak.deleteMany({ where: { userId: user.id } });
      
      // Delete user
      await tx.user.delete({ where: { id: user.id } });
    });
    
    console.log(`✅ User ${email} has been deleted successfully!`);
    console.log('\n🧪 You can now test signup with this email again:');
    console.log(`   http://localhost:3000/signup\n`);
    
  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

// Run the script
resetTestUser().catch(console.error);