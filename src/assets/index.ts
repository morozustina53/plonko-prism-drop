/**
 * The ONLY place that references the generated PNGs.
 * Names are fixed by the asset contract — never invent another one.
 */
export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  orb: require('../../assets/sprite_1.png'),
  prism: require('../../assets/sprite_2.png'),
  peg: require('../../assets/sprite_3.png'),
  shard: require('../../assets/sprite_4.png'),
  burst: require('../../assets/sprite_5.png'),
  plateRound: require('../../assets/button_round.png'),
} as const;

export type AssetKey = keyof typeof assets;
