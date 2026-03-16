import axios from 'axios';

async function testSeeding() {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/register", {
      email: `test_seeder_${Date.now()}@example.com`,
      password: "securepassword",
      firstName: "Test",
      lastName: "Seeder",
      role: "PATIENT"
    });
    console.log("SUCCESS");
    console.log("Registered User:", res.data.user);
    console.log("Assigned PHID:", res.data.user.phid);
  } catch (err) {
    if (axios.isAxiosError(err)) {
        console.error("FAILED:", err.response?.data);
    } else {
        console.error("FAILED", err);
    }
  }
}

testSeeding();
