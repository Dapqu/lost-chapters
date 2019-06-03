import { levels } from "./levels";
import { readBook } from "./utils/book"

export function loadSave() {
    if (localStorage.getItem("save") != null) {
        game.save = JSON.parse(localStorage.getItem("save"));
    } else newGame();
}

export function save() {
    game.save.playerPosition = {
        x: ((game.player.worldPosition.x - 8) / 16),
        y: ((game.player.worldPosition.y + 8) / 16)
    };
    game.save.playerState = game.player.state;
    localStorage.setItem("save", JSON.stringify(game.save));
}

export function newGame() {
    game.save = {
        level: "school"
    }
    game.save.playerPosition = levels[game.save.level].startPosition;
    localStorage.setItem("save", JSON.stringify(game.save));

    setTimeout(() => readBook("book_intro"), 5000)
}