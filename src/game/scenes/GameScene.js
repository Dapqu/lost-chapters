import { addSounds, startMusic, sounds } from "../utils/audio"
import { Player } from "../characters/Player"
import { goToLevel, positionPlayerAtStartOfLevel } from "../levels"
import { openBook } from "../utils/book";
import { updateHud } from "../utils/hud"
import { save } from "../save"

let hurtFlag

export class GameScene {
	create() {
		game.scale.setGameSize(255, 144);
		this.spawnPlayer()
		game.controls.ACTION.onPress(() => game.player && game.player.doAction())

		if (!game.save.hasReadIntro) {
			game.paused = true;
			openBook("book_intro").then(() => {
				game.paused = false;
				game.save.hasReadIntro = true;
				this.startGame();
			})
		} else {
			this.startGame();
		}
	}

	startGame() {
		startMusic();
		addSounds()
		goToLevel(game.save.level)
		updateHud()
		save()
	}

	spawnPlayer() {
		game.player = new Player(game)
		game.camera.follow(game.player)
	}

	update() {
		if (!game.level) return;

		// physics
		game.physics.arcade.collide(game.player, game.level.layer_collisions)
		game.physics.arcade.collide(game.player, game.groups.pnj)
		game.physics.arcade.collide(game.player, game.groups.objects)
		game.physics.arcade.collide(game.groups.enemies, game.level.layer_collisions)

		if (game.player.alive) {
			//overlaps
			game.physics.arcade.overlap(game.player, game.groups.enemies, this.hurtPlayer, null, this)
			game.physics.arcade.overlap(game.player, game.groups.triggers, this.onTrigger, null, this)
		}

		game.player.updateControls()

		//this.debugGame();
		this.hurtManager()

		game.level.update()

		game.groups.render.sort('y', Phaser.Group.SORT_ASCENDING); // depth sort
		updateHud()
	}

	onExitReached() {
		game.state.start("GameOver")
		game.music.stop()
	}

	onTrigger(player, trigger) {
		if (!game.level.loading) trigger.action();
	}

	hurtPlayer() {
		if (hurtFlag) {
			return
		}
		hurtFlag = true
		this.game.time.reset()

		game.player.alpha = 0.5
		game.player.lucidity--

		sounds.HURT.play()
		if (game.player.lucidity < 1) {
			this.gameOver()
		}
	}

	gameOver() {
		game.music.stop()
		game.state.start("GameOver")
	}

	hurtManager() {
		if (hurtFlag && this.game.time.totalElapsedSeconds() > 2) {
			hurtFlag = false
			game.player.alpha = 1
		}
	}

	debugGame() {
		// return;
		//game.debug.spriteInfo(this.player, 30, 30);

		game.debug.body(game.player)
		game.debug.pixel(game.player.watchingPoint.x, game.player.watchingPoint.y, "rgba(0,255,0,1)", 1);
		game.groups.enemies.forEachAlive(this.renderGroup, this)
		game.groups.pnj.forEachAlive(this.renderGroup, this)
		game.groups.objects.forEachAlive(this.renderGroup, this)
		game.groups.triggers.forEachAlive(this.renderGroup, this)
	}

	renderGroup(member) {
		game.debug.body(member)
	}
}

