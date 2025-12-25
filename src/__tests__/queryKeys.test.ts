import { queryKeys } from "@/shared/data/queryKeys";
import { playerQueryKeys } from "@/features/players/services/player.service";
import { gameQueryKeys } from "@/features/games/services/games.service";
import { eventQueryKeys } from "@/features/events/services/events.service";

describe("query keys", () => {
  it("keeps shared keys stable", () => {
    expect(queryKeys.players.list()).toEqual(["players", "list"]);
    expect(queryKeys.games.list()).toEqual(["games", "list", "all"]);
    expect(queryKeys.events.list()).toEqual(["events", "list", "all"]);
  });

  it("keeps feature-specific keys stable", () => {
    expect(playerQueryKeys.list()).toEqual(["players", "list"]);
    expect(gameQueryKeys.list()).toEqual(["games", "list", "all"]);
    expect(eventQueryKeys.list()).toEqual(["events", "list", "all"]);
  });
});



