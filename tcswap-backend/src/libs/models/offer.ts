import Card from "./card";

export default interface Offer{
    id: number,
    requestor: string,
    decider: string,
    status:'accepted'|'rejected'|'pending',
    requestorCards: Card[],
    deciderCards: Card[],
};