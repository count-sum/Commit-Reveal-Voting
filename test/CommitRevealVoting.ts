import { expect } from 'chai';
import { TestContext } from './helpers/types';
import { setupTest } from './helpers/setup';
import { createVoteCommitment, moveToPhase, VoteData } from './helpers/utils';

describe('CommitRevealVoting', () => {
    let context: TestContext;
    let voter1Votes: VoteData;
    let voter2Votes: VoteData;

    beforeEach(async () => {
        context = await setupTest();

        // Try to register voters, but handle potential "already registered" errors
        for (const voter of context.voters) {
            try {
                await context.contracts.voting.registerVoter(voter.address);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                // If already registered, we can continue
                if (!error.message.includes('Voter already registered')) {
                    throw error;
                }
            }
        }

        voter1Votes = await createVoteCommitment(true);
        voter2Votes = await createVoteCommitment(false);
    });

    describe('Voting Phases', () => {
        it('should start with NotStarted phase', async () => {
            expect(await context.contracts.voting.isCommitPhase()).to.be.false;
            expect(await context.contracts.voting.isRevealPhase()).to.be.false;
            expect(await context.contracts.voting.isVotingEnded()).to.be.false;
        });

        it('should transition through phases correctly', async () => {
            await context.contracts.voting.startVoting();
            expect(await context.contracts.voting.isCommitPhase()).to.be.true;

            await moveToPhase(context.durations.commit);
            expect(await context.contracts.voting.isRevealPhase()).to.be.true;

            await moveToPhase(context.durations.reveal);
            expect(await context.contracts.voting.isVotingEnded()).to.be.true;
        });
    });

    describe('Voting Process', () => {
        beforeEach(async () => {
            await context.contracts.voting.startVoting();
        });

        it('should allow voters to commit and reveal votes', async () => {
            // Commit votes
            await context.contracts.voting
                .connect(context.voters[0])
                .commitVote(voter1Votes.commitment);

            await context.contracts.voting
                .connect(context.voters[1])
                .commitVote(voter2Votes.commitment);

            // Move to reveal phase
            await moveToPhase(context.durations.commit);

            // Reveal votes
            await context.contracts.voting
                .connect(context.voters[0])
                .revealVote(voter1Votes.vote, voter1Votes.secret);

            await context.contracts.voting
                .connect(context.voters[1])
                .revealVote(voter2Votes.vote, voter2Votes.secret);

            // Move to end of voting
            await moveToPhase(context.durations.reveal);

            // Check results
            const [yesVotes, noVotes] = await context.contracts.voting.getResults();
            expect(yesVotes).to.equal(1);
            expect(noVotes).to.equal(1);
        });
    });
});
