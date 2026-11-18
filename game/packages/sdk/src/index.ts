/**
 * @swarajya/sdk: the only API a mission package may use to talk to the Shell.
 *
 * Session 0: draft types only (see docs/tech/mission-sdk.md). The Shell implements
 * MissionContext in Session 6; until then these interfaces may change freely.
 */

export const SDK_VERSION = "0.1.0";

/** Every entity carries exactly one respect tag; InteractionGuard decides what the player may do. */
export const RESPECT_TAGS = ["revered", "ally", "civilian", "enemy", "animal", "prop"] as const;
export type RespectTag = (typeof RESPECT_TAGS)[number];

export type Vec3Like = Readonly<{ x: number; y: number; z: number }>;

export type NpcBehaviour = "follow" | "guard" | "patrol" | "attack" | "idle";

export interface NpcHandle {
  readonly id: number;
  readonly poolKey: string;
  readonly respectTag: RespectTag;
}

export interface NpcSpawnOptions {
  position: Vec3Like;
  respectTag: RespectTag;
  variant?: string;
  behaviour?: NpcBehaviour;
}

export interface AssetsApi {
  load(id: string): Promise<void>;
  get(id: string): unknown;
}

export interface WorldApi {
  loadMap(mapId: string): Promise<void>;
}

export interface PlayerApi {
  readonly position: Vec3Like;
  teleport(position: Vec3Like): void;
  giveAbility(abilityId: string): void;
}

export interface NpcApi {
  spawn(poolKey: string, options: NpcSpawnOptions): NpcHandle;
  setBehaviour(handle: NpcHandle, behaviour: NpcBehaviour): void;
  despawn(handle: NpcHandle): void;
}

export interface ObjectivesApi {
  add(id: string, text: string, marker?: Vec3Like): void;
  complete(id: string): void;
  fail(id: string, reason?: string): void;
  completeMission(): void;
  failMission(reason?: string): void;
}

export interface DialogueApi {
  say(speakerId: string, lines: readonly string[]): Promise<void>;
}

export type Unsubscribe = () => void;

export interface EventsApi {
  on(name: string, handler: (payload: unknown) => void): Unsubscribe;
  emit(name: string, payload?: unknown): void;
}

export interface ProgressApi {
  getFlag(name: string): boolean;
  setFlag(name: string, value: boolean): void;
}

export interface UiApi {
  toast(text: string): void;
}

export type PlayerAction = "hit" | "push" | "talk" | "mount" | "pay-respects";

export interface GuardApi {
  canPerform(action: PlayerAction, target: RespectTag): boolean;
}

export interface TimeApi {
  readonly now: number;
  readonly delta: number;
  after(seconds: number, fn: () => void): Unsubscribe;
  every(seconds: number, fn: () => void): Unsubscribe;
}

export interface LogApi {
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}

export interface MissionContext {
  readonly assets: AssetsApi;
  readonly world: WorldApi;
  readonly player: PlayerApi;
  readonly npc: NpcApi;
  readonly objectives: ObjectivesApi;
  readonly dialogue: DialogueApi;
  readonly events: EventsApi;
  readonly progress: ProgressApi;
  readonly ui: UiApi;
  readonly guard: GuardApi;
  readonly time: TimeApi;
  readonly log: LogApi;
}

export interface MissionDefinition {
  readonly id: string;
  load(ctx: MissionContext): Promise<void>;
  start(ctx: MissionContext): void;
  update?(ctx: MissionContext, dt: number): void;
  unload(ctx: MissionContext): Promise<void>;
}

const MISSION_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Identity helper that type-checks a mission and validates its id. */
export function defineMission<T extends MissionDefinition>(mission: T): T {
  if (!MISSION_ID.test(mission.id)) {
    throw new Error(`Invalid mission id "${mission.id}": use kebab-case, e.g. "ch0-test-walk".`);
  }
  return mission;
}
