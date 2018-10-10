import { Quest, QuestType } from '../types/Quest';

export const quests: Quest[] = [
    {
        'id': 1,
        'type': QuestType.Episode,
        'npcCoordinates': {
            'x': 40,
            'y': 90
        },
        'npcName': 'Heidi',
        'location': 1,
        'experience': {
            'base': 256,
            'tm': 256
        },
        'request': 'Find and talk to Bunny Maid',
        'condition': 'Level 1+, have Registration Form',
        'rewards': ['Rookie Sword', 'Rookie Hat', 'Rookie Shield'],
        'notes': ['Lorem ipsum dolor sit amet']
    }
];
