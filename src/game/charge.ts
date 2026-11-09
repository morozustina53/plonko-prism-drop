import {PRISM_CHARGE_MAX} from '../constants/config';

export const addCharge = (charge: number, lit: number): number =>
  Math.min(PRISM_CHARGE_MAX, Math.max(0, charge) + Math.max(0, lit));

export const canArm = (charge: number, armed: boolean): boolean =>
  !armed && charge >= PRISM_CHARGE_MAX;

export const spendCharge = (): number => 0;

export const chargeSegments = (charge: number, segments: number): number =>
  Math.round((Math.min(charge, PRISM_CHARGE_MAX) / PRISM_CHARGE_MAX) * segments);
