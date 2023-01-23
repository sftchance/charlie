const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Charlie", function () {
  async function deployAggregator() {
    const [owner, otherAccount] = await ethers.getSigners();

    const CharlieAuthority = await ethers.getContractFactory("CharlieAuthority");
    const charlieAuthority = await CharlieAuthority.deploy();

    const Charlie = await ethers.getContractFactory("Charlie");
    const charlie = await Charlie.deploy();

    const MockToken = await ethers.getContractFactory("MockToken");
    const mockTokens = [
      await MockToken.deploy("Mock Token", "MTK", 1000000),
      await MockToken.deploy("Mock Token 2", "MTK2", 1000000),
      await MockToken.deploy("Mock Token 3", "MTK3", 1000000),
    ];

    return { charlieAuthority, charlie, mockTokens, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Contracts should be deployed", async function () {
      const { charlie } = await loadFixture(deployAggregator);
      expect(charlie.address).to.not.equal(0);
    });

    it("Mock tokens should be deployed", async function () {
      const { mockTokens } = await loadFixture(deployAggregator);
      expect(mockTokens[0].address).to.not.equal(mockTokens[1].address);
      expect(mockTokens[0].address).to.not.equal(mockTokens[2].address);
      expect(mockTokens[1].address).to.not.equal(mockTokens[2].address);
    });
  });

  describe("Charlie", function () {
    it("Should fail due to array length mismatch.", async function () {
      const { charlie, mockTokens, owner, otherAccount } = await loadFixture(deployAggregator);

      const targets = [mockTokens[0].address, mockTokens[1].address, mockTokens[2].address];
      const calls = [
        mockTokens[0].interface.encodeFunctionData("balanceOf", [otherAccount.address]),
        mockTokens[1].interface.encodeFunctionData("balanceOf", [otherAccount.address]),
        mockTokens[2].interface.encodeFunctionData("balanceOf", [otherAccount.address]),
        mockTokens[0].interface.encodeFunctionData("balanceOf", [owner.address]),
      ];

      await expect(charlie.callStatic.aggregate(targets, calls, false)).to.be.revertedWith("Charlie: targets and calls must be the same length");
    });

    it("Should check the balance of multiple tokens in one read.", async function () {
      const { charlie, mockTokens, owner, otherAccount } = await loadFixture(deployAggregator);

      const targets = [mockTokens[0].address, mockTokens[1].address, mockTokens[2].address, mockTokens[0].address];
      const calls = [
        mockTokens[0].interface.encodeFunctionData("balanceOf", [otherAccount.address]),
        mockTokens[1].interface.encodeFunctionData("balanceOf", [otherAccount.address]),
        mockTokens[2].interface.encodeFunctionData("balanceOf", [otherAccount.address]),
        mockTokens[0].interface.encodeFunctionData("balanceOf", [owner.address]),
      ];

      // we can use any provider for this on the front end
      const result = await charlie.callStatic.aggregate(targets, calls, false);

      expect(parseInt(result[0].slice(2), 16)).to.equal(0);
      expect(parseInt(result[1].slice(2), 16)).to.equal(0);
      expect(parseInt(result[2].slice(2), 16)).to.equal(0);
      expect(parseInt(result[3].slice(2), 16)).to.equal(1000000);
    });

    it("Should fail due to invalid signature and blocking.", async function () {
      const { charlie, mockTokens, owner, otherAccount } = await loadFixture(deployAggregator);

      mockTokens[0].approve(charlie.address, 1000000);
      mockTokens[1].approve(charlie.address, 1000000);
      mockTokens[2].approve(charlie.address, 1000000);

      const targets = [mockTokens[0].address, mockTokens[1].address, mockTokens[2].address];

      const delegations = 3;
      const delegate = otherAccount.address;
      const expiry = Math.floor(Date.now() / 1000) + 3600;

      let calls = []

      for (let i = 0; i < delegations; i++) {
        const delegateSignature = await owner._signTypedData(
          {
            name: "Charlie",
            version: "1",
            chainId: 31337,
            verifyingContract: charlie.address,
          },
          {
            Delegation: [
              { name: "delegatee", type: "address" },
              { name: "nonce", type: "uint256" },
              { name: "expiry", type: "uint256" },
            ],
          },
          {
            delegatee: delegate,
            nonce: i,
            expiry,
          }
        );

        const { v, r, s } = ethers.utils.splitSignature(delegateSignature);

        const call = mockTokens[i].interface.encodeFunctionData("delegateBySig", [
          delegate,
          0,
          1,
          v,
          r,
          s
        ]);

        calls.push(call);
      }

      await expect(charlie.callStatic.aggregate(targets, calls, true)).to.be.revertedWith("Charlie: call failed");
    });

    it("Should delegate several tokens in one transaction.", async function () {
      const { charlie, mockTokens, owner, otherAccount } = await loadFixture(deployAggregator);

      mockTokens[0].approve(charlie.address, 1000000);
      mockTokens[1].approve(charlie.address, 1000000);
      mockTokens[2].approve(charlie.address, 1000000);

      const targets = [mockTokens[0].address, mockTokens[1].address, mockTokens[2].address];

      const delegations = 3;
      const delegate = otherAccount.address;
      const expiry = Math.floor(Date.now() / 1000) + 3600;

      let calls = []

      for (let i = 0; i < delegations; i++) {
        const delegateSignature = await owner._signTypedData(
          {
            name: "Charlie",
            version: "1",
            chainId: 31337,
            verifyingContract: charlie.address,
          },
          {
            Delegation: [
              { name: "delegatee", type: "address" },
              { name: "nonce", type: "uint256" },
              { name: "expiry", type: "uint256" },
            ],
          },
          {
            delegatee: delegate,
            nonce: i,
            expiry,
          }
        );

        const { v, r, s } = ethers.utils.splitSignature(delegateSignature);

        const call = mockTokens[i].interface.encodeFunctionData("delegateBySig", [
          delegate,
          0,
          expiry,
          v,
          r,
          s
        ]);

        calls.push(call);
      }

      const result = await charlie.callStatic.aggregate(targets, calls, false);

      expect(result[0].success).to.equal(true);
      expect(result[1].success).to.equal(true);
      expect(result[2].success).to.equal(true);

      await charlie.aggregate(targets, calls, true);
    });
  });

  describe("CharlieAuthority", function () {
    it("Should be able to update authority to CharlieAuthority", async function () {
      const { charlieAuthority, charlie, mockTokens, owner, otherAccount } = await loadFixture(deployAggregator);

      await charlie.setAuthority(charlieAuthority.address);
    });
  });
});
