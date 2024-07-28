# Techgyan Entity

Techgyan Entity is an open-source article publishing platform dedicated to providing insightful and up-to-date content on the latest trends in technology, innovation, and digital transformation. The platform features contributions from global experts, ensuring diverse and high-quality content for tech enthusiasts and professionals alike.

## Features

- **Next.js**: A powerful React framework for building fast and scalable web applications.
- **Prisma**: A next-generation ORM that simplifies database access with an auto-generated and type-safe query builder.
- **MongoDB**: A NoSQL database known for its flexibility and scalability.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.
- **Material-UI**: A popular React UI framework offering a rich set of pre-designed components.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later) or Yarn (v1.22.x or later)
- MongoDB (v6.x or later)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ravikan6/techgyanentity.git
   cd techgyanentity
   ```

2. **Install dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Using Yarn:

   ```bash
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/your-database-name"
   ```

4. **Generate Prisma client:**

   ```bash
   npx prisma generate
   ```

5. **Run the development server:**

   Using npm:

   ```bash
   npm run dev
   ```

   Using Yarn:

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

We welcome contributions from the community! If you have ideas for new features or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Built with ❤️ by the Techgyan Entity community.