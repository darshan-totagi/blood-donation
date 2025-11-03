# Contributing to Blood-Donation

We are thrilled that you're interested in contributing to **Blood-Donation**! Whether you're reporting a bug, suggesting a new feature, or submitting code, your contributions are invaluable and help make this project better for everyone.

Please take a moment to review this document to make the contribution process as clear and effective as possible.

## 🤝 Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior by **creating an Issue marked 'Code of Conduct Violation'**.

---

## 💡 Ways to Contribute

There are many ways to contribute, even if you don't write code:

1.  **Reporting Bugs in Issues:** Have you noticed a problem? Kindly create a new issue with a detailed description of the issue and instructions on how to replicate the unexpected behavior.
2.  **Suggesting Enhancements in Issues:** Do you have a good idea for a new feature or enhancement? Send in a proposal through Issues outlining the change's use-case and advantages.
3.  **Enhancing Documentation:** Adoption and usability depend on clarity. Assist us in correcting typos, rearranging the content, or providing clarification on unclear passages in the project's documentation files.
4.  **Writing Code:** Are you ready to start writing code? You can help by submitting a Pull Request to optimize existing code, add new features, or fix reported bugs.

---

## 🐞 Reporting Bugs

Before creating a bug report, please check the existing issues to see if the problem has already been reported.

Please provide as much information as you can when reporting a bug so that the maintainers can quickly reproduce and resolve it. An essential description needs to contain:

* **A Clear and Descriptive Title:** Provide a succinct summary of the problem (e.g., "Page X fails to load after clicking Y").
* **Reproducible Steps:** A numbered list of the precise steps that were taken in order to experience the bug.
* **Expected Behavior:** The outcome you thought should have occurred.
* **Actual Behavior:** A description of an unexpected or inaccurate actual event.
* **Environment Details:** Details about your configuration, including device type, operating system, and browser/app version.
* **Logs/Screenshots:** (If applicable) Include any error messages from the console or logs, as well as visual proof.

## ✨ Suggesting Enhancements

Before suggesting an enhancement, check the existing issues to ensure it hasn't already been discussed.

When creating an enhancement suggestion, please include:

* **A clear and descriptive title.**
* **Detailed description:** Explain the change you are suggesting and why it would be useful.
* **Use-case:** Provide a clear example of how this enhancement would be used.
* **Possible alternatives:** If you can, describe alternative solutions you've considered.

## 💻 Submitting a Pull Request (PR)

If you're ready to contribute code, here's the process:

1.  **Fork** the repository and clone your fork locally.
2.  **Create a new branch** from `main` (or the appropriate base branch) for your fix or feature:
    ```bash
    git checkout main
    git pull origin main
    git checkout -b feature/your-feature-name
    ```
3.  **Make your changes.**
4.  **Commit your changes** with a clear and concise commit message.
    * *(Tip: Use a commit prefix like `feat:`, `fix:`, `docs:`, etc.)*
5.  **Push your branch** to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```
6.  **Open a Pull Request** in the main repository.
    * Fill out the PR template with all requested information.
    * Reference the issue number your PR addresses (e.g., `Fixes #123`).

### Development Setup

This project is a **full-stack application** with a **React (Vite + Tailwind)** frontend and a **Node/Express + MongoDB** backend.

You will need **Node.js**, **npm**, and a **MongoDB connection string** (Atlas or local) installed.

Follow these quick-start steps in **two separate terminals**:

#### 1) Backend (Server)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Create a `.env` file (copying from `.env.example`) and set your `MONGO_URI`.
3.  Install dependencies and start the server:
    ```bash
    npm install
    npm run dev
    ```
    The backend runs on `http://localhost:5000`.

#### 2) Frontend (Client)

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies and start the client:
    ```bash
    npm install
    npm run dev
    ```
    The frontend runs on `http://localhost:5173` and automatically talks to the backend at `http://localhost:5000` (change this in `client/.env` if needed).

---

## 🏆 Contributors (To be added to README.md)

As noted in the proposed solution, we are committed to recognizing our community. The full list of contributors will be proudly displayed in the `README.md` file using the `contrib.rocks` badge.

Thank you for your valuable contributions!