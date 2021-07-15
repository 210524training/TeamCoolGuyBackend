export default interface Card{
    id: number,
    card_owner: string,
    card_identifier: string,
    game: string,
    condition: string,
    num_owned: number,
    role?: 'player'| 'store owner'
};