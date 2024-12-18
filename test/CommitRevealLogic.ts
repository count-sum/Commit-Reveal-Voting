import { expect } from "chai";
import { setupTest } from "./helpers/setup";
import { TestContext } from "./helpers/types";
import { createVoteCommitment } from "./helpers/utils";


describe("CommitRevealLogic", () => {
    let context: TestContext;
    
    beforeEach(async () => {
        context = await setupTest();
    });
    
    describe("Vote Commitment", () => {
        it("should accept valid commitments", async () => {
            const voter = context.voters[0];
            const voteData = await createVoteCommitment(true);
            

            await context.contracts.commitRevealLogic.commit(
                voter.address, 
                voteData.commitment
            );
            
            const voterInfo = await context.contracts.commitRevealLogic.votes(
                voter.address
            );
            expect(voterInfo.commitment).to.equal(voteData.commitment);
            expect(voterInfo.revealed).to.be.false;
        });
        
        it("should prevent duplicate commitments", async () => {
            const voter = context.voters[0];
            const voteData = await createVoteCommitment(true);
            
            await context.contracts.commitRevealLogic.commit(
                voter.address,
                voteData.commitment
            );
            
            await expect(
                context.contracts.commitRevealLogic.commit(
                    voter.address,
                    voteData.commitment
                )
            ).to.be.revertedWith("Already committed");
        });
    });
    
    describe("Vote Reveal", () => {
        it("should accept valid reveals", async () => {
            const voter = context.voters[0];
            const voteData = await createVoteCommitment(true);
            
            // Commit vote
            await context.contracts.commitRevealLogic.commit(
                voter.address,
                voteData.commitment
            );
            
            // Reveal vote
            await context.contracts.commitRevealLogic.reveal(
                voter.address,
                voteData.vote,
                voteData.secret
            );
            
            const voterInfo = await context.contracts.commitRevealLogic.votes(
                voter.address
            );
            expect(voterInfo.revealed).to.be.true;
            expect(voterInfo.vote).to.equal(voteData.vote);
        });
        
        it("should reject invalid reveals", async () => {
            const voter = context.voters[0];
            const voteData = await createVoteCommitment(true);
            
            // Commit vote
            await context.contracts.commitRevealLogic.commit(
                voter.address,
                voteData.commitment
            );
            
            // Reveal with a different vote
            await expect(
                context.contracts.commitRevealLogic.reveal(
                    voter.address,
                    !voteData.vote,
                    voteData.secret
                )
            ).to.be.revertedWith("Invalid reveal");
        });
    });
});