import { expect } from "chai";
import { describe } from "mocha";
import { ethers } from "hardhat";

describe("DAOplex contracts test", async function() {
    let deployer, daoPlexBond:any, bondCreator:any;

    const fixture = async () => {
        const DAOPlexBond = await ethers.getContractFactory("DAOPlexBond");
        daoPlexBond = await DAOPlexBond.deploy();
        await daoPlexBond.deployed();

        const BondCreator = await ethers.getContractFactory("BondCreator");
        bondCreator = await BondCreator.deploy();
        await bondCreator.deployed();

        const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
        await daoPlexBond.grantRole(MINTER_ROLE, bondCreator.address);
    };

    before('create fixture loader', async () => {
        [deployer] = await ethers.getSigners();
    });

    describe("Contract deployment", async function() {

        beforeEach('deploy contracts', async () => {
            await fixture();
        });

        it('1. Contracts deploy successfully', async function () {
            expect((daoPlexBond as any)?.address).to.not.be.undefined;
            expect((daoPlexBond as any)?.address).to.not.equal(ethers.constants.AddressZero);

            expect((bondCreator as any)?.address).to.not.be.undefined;
            expect((bondCreator as any)?.address).to.not.equal(ethers.constants.AddressZero);
        });
    });
});