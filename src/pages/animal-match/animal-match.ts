import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {putTabBar, removeTabBar, wait} from "../../model/tool";
import {Observable} from "rxjs";
import {SaveProvider} from "../../providers/save";

declare let Phaser;
let that; //Used to call the class attributes
@IonicPage()
@Component({
  selector: 'page-animal-match',
  templateUrl: 'animal-match.html',
})
export class AnimalMatchPage {
  private score;
  private timer;
  private canLeave;
  constructor(public navCtrl: NavController, public navParams: NavParams, public save: SaveProvider,public alertCtrl: AlertController) {
    this.timer=navParams.get("timeLimit");
    that=this;
  }
  ionViewCanLeave(): boolean{
    return this.canLeave;
  }
  ionViewDidEnter() {
    this.score=0;
    this.canLeave=false;
    removeTabBar();
    this.buildPhaserRenderer();
    const source = Observable
      .interval(1000)
      .timeInterval()
      .take(this.navParams.get("timeLimit"));
    source.subscribe(val=>{
        this.timer--;},
      (error)=>{
        console.log(error);
      },
      () =>  {
        let gemsEarned=Math.round((this.score/24)*100)/100;
        const endGame = this.alertCtrl.create({
          subTitle: "Time finish your score is " + this.score+ ". You earn " +gemsEarned +" Gems.",
          buttons: [{
            text: 'OK',
          }],
          enableBackdropDismiss :false,
        });
        endGame.present();
        endGame.onDidDismiss(()=>{
          this.canLeave=true;
          this.save.player.gems+=gemsEarned;
          this.save.saveProfile();
          putTabBar();
          this.navCtrl.pop();
        })
      }
    );
  }
  private buildPhaserRenderer() {
    let game = new Phaser.Game(window.innerWidth/1.1, window.innerHeight / 1.4, Phaser.CANVAS, 'game', {preload: preload, create: create});
    let IMG_SIZE = 32;
    let IMG_SPACING = 3.5;
    let IMG_SIZE_SPACED = IMG_SIZE + IMG_SPACING;
    let BOARD_COLS = 0;
    let BOARD_ROWS =0 ;
    let MATCH_MIN = 3;

    let animals;
    let selectedAnimal = null;
    let selectedAnimalStartPos;
    let selectedAnimalTween;
    let tempShiftedAnimal = null;
    let allowInput;
    function preload()
    {

      game.load.spritesheet("ANIMALS", "assets/imgs/animals.png", IMG_SIZE, IMG_SIZE, 5);
      if(that.save.musicOn) {
        game.load.audio('music', 'assets/sounds/Sweet Ice.ogg');
      }
    }
    function create()
    {
      game.stage.backgroundColor = "#FFFFFF";
      if(that.save.musicOn){
        var music = game.add.audio('music');
        music.play();
      }
      spawnBoard();

      selectedAnimalStartPos = {x: 0, y: 0};

      // used to disable input while animals are dropping down and respawning
      allowInput = false;
      that.score=0;
      game.input.addMoveCallback(slideAnimal, this);

    }
    function releaseanimal()
    {

      if (tempShiftedAnimal === null) {
        selectedAnimal = null;
        return;
      }
      let canKill = checkAndKillAnimalMatches(selectedAnimal);
      canKill = checkAndKillAnimalMatches(tempShiftedAnimal) || canKill;
      if (!canKill) // there are no matches so swap the animals back to the original positions
      {
        let animal = selectedAnimal;

        if (animal.posX !== selectedAnimalStartPos.x || animal.posY !== selectedAnimalStartPos.y) {
          if (selectedAnimalTween !== null) {
            game.tweens.remove(selectedAnimalTween);
          }

          selectedAnimalTween = tweenAnimalPos(animal, selectedAnimalStartPos.x, selectedAnimalStartPos.y, 1);

          if (tempShiftedAnimal !== null) {
            tweenAnimalPos(tempShiftedAnimal, animal.posX, animal.posY, 1);
          }

          swapAnimalPosition(animal, tempShiftedAnimal);

          tempShiftedAnimal = null;

        }
      }
      removeKilledAnimals();

      let dropAnimalDuration = dropAnimals();

      // delay board refilling until all existing animals have dropped down
      game.time.events.add(dropAnimalDuration * 100, refillBoard);

      allowInput = false;

      selectedAnimal = null;
      tempShiftedAnimal = null;
    }

    function slideAnimal(pointer, x, y)
    {

      // check if a selected animal should be moved and do it

      if (selectedAnimal && pointer.isDown) {
        let cursorAnimalPosX = getAnimalPos(x);
        let cursorAnimalPosY = getAnimalPos(y);

        if (checkIfAnimalCanBeMovedHere(selectedAnimalStartPos.x, selectedAnimalStartPos.y, cursorAnimalPosX, cursorAnimalPosY)) {
          if (cursorAnimalPosX !== selectedAnimal.posX || cursorAnimalPosY !== selectedAnimal.posY) {
            // move currently selected animal
            if (selectedAnimalTween !== null) {
              game.tweens.remove(selectedAnimalTween);
            }

            selectedAnimalTween = tweenAnimalPos(selectedAnimal, cursorAnimalPosX, cursorAnimalPosY, 1);

            animals.bringToTop(selectedAnimal);

            // if we moved a animal to make way for the selected animal earlier, move it back into its starting position
            if (tempShiftedAnimal !== null) {
              tweenAnimalPos(tempShiftedAnimal, selectedAnimal.posX, selectedAnimal.posY, 1);
              swapAnimalPosition(selectedAnimal, tempShiftedAnimal);
            }

            // when the player moves the selected animal, we need to swap the position of the selected animal with the animal currently in that position
            tempShiftedAnimal = getAnimal(cursorAnimalPosX, cursorAnimalPosY);

            if (tempShiftedAnimal === selectedAnimal) {
              tempShiftedAnimal = null;
            } else {
              tweenAnimalPos(tempShiftedAnimal, selectedAnimal.posX, selectedAnimal.posY, 1);
              swapAnimalPosition(selectedAnimal, tempShiftedAnimal);
            }
          }
        }
      }
    }

    function spawnBoard()
    {

      BOARD_COLS = Math.floor(game.world.width / IMG_SIZE_SPACED);
      BOARD_ROWS = Math.floor(game.world.height / IMG_SIZE_SPACED);

      animals = game.add.group();

      for (let i = 0; i < BOARD_COLS; i++) {
        for (let j = 0; j < BOARD_ROWS; j++) {
          let animal = animals.create(i * IMG_SIZE_SPACED, j * IMG_SIZE_SPACED, "ANIMALS");
          animal.name = 'animal' + i.toString() + 'x' + j.toString();
          animal.inputEnabled = true;
          animal.events.onInputDown.add(selectAnimal, this);
          animal.events.onInputUp.add(releaseanimal, this);
          randomizeAnimalType(animal);
          setAnimalPos(animal, i, j); // each animal has a position on the board
          animal.kill();
        }
      }

      removeKilledAnimals();

      let dropAnimalDuration = dropAnimals();

      // delay board refilling until all existing animals have dropped down
      game.time.events.add(dropAnimalDuration * 100, refillBoard);

      allowInput = false;

      selectedAnimal = null;
      tempShiftedAnimal = null;

    }

    // select a Animal and remember its starting position
    function selectAnimal(Animal)
    {

      if (allowInput) {
        selectedAnimal = Animal;
        selectedAnimalStartPos.x = Animal.posX;
        selectedAnimalStartPos.y = Animal.posY;
      }

    }

    // find a Animal on the board according to its position on the board
    function getAnimal(posX, posY)
    {

      return animals.iterate("id", calcAnimalId(posX, posY), Phaser.Group.RETURN_CHILD);

    }

    // convert world coordinates to board position
    function getAnimalPos(coordinate)
    {

      return Math.floor(coordinate / IMG_SIZE_SPACED);

    }

    // set the position on the board for a Animal
    function setAnimalPos(Animal, posX, posY)
    {

      Animal.posX = posX;
      Animal.posY = posY;
      Animal.id = calcAnimalId(posX, posY);

    }

    // the Animal id is used by getAnimal() to find specific Animals in the group
    // each position on the board has a unique id
    function calcAnimalId(posX, posY)
    {

      return posX + posY * BOARD_COLS;

    }

    // since the Animals are a spritesheet, their type is the same as the current frame number
    function  getAnimalType(Animal)
    {

      return Animal.frame;

    }

    // set the Animal spritesheet to a random frame
    function randomizeAnimalType(Animal)
    {

      Animal.frame = game.rnd.integerInRange(0, Animal.animations.frameTotal - 1);

    }

    // Animals can only be moved 1 square up/down or left/right
    function checkIfAnimalCanBeMovedHere(fromPosX, fromPosY, toPosX, toPosY)
    {

      if (toPosX < 0 || toPosX >= BOARD_COLS || toPosY < 0 || toPosY >= BOARD_ROWS) {
        return false;
      }

      if (fromPosX === toPosX && fromPosY >= toPosY - 1 && fromPosY <= toPosY + 1) {
        return true;
      }

      if (fromPosY === toPosY && fromPosX >= toPosX - 1 && fromPosX <= toPosX + 1) {
        return true;
      }

      return false;
    }

    // count how many Animals of the same color lie in a given direction
    // eg if moveX=1 and moveY=0, it will count how many Animals of the same color lie to the right of the Animal
    // stops counting as soon as a Animal of a different color or the board end is encountered
    function countSameTypeAnimals(startAnimal, moveX, moveY)
    {

      let curX = startAnimal.posX + moveX;
      let curY = startAnimal.posY + moveY;
      let count = 0;

      while (curX >= 0 && curY >= 0 && curX < BOARD_COLS && curY < BOARD_ROWS && getAnimalType(getAnimal(curX, curY)) === getAnimalType(startAnimal)) {
        count++;
        curX += moveX;
        curY += moveY;
      }

      return count;

    }

    // swap the position of 2 Animals when the player drags the selected Animal into a new location
    function swapAnimalPosition(Animal1, Animal2)
    {

      let tempPosX = Animal1.posX;
      let tempPosY = Animal1.posY;
      setAnimalPos(Animal1, Animal2.posX, Animal2.posY);
      setAnimalPos(Animal2, tempPosX, tempPosY);

    }

    // count how many Animals of the same color are above, below, to the left and right
    // if there are more than 3 matched horizontally or vertically, kill those Animals
    // if no match was made, move the Animals back into their starting positions
    function checkAndKillAnimalMatches(Animal)
    {

      if (Animal === null) {
        return;
      }

      let canKill = false;

      // process the selected Animal

      let countUp = countSameTypeAnimals(Animal, 0, -1);
      let countDown = countSameTypeAnimals(Animal, 0, 1);
      let countLeft = countSameTypeAnimals(Animal, -1, 0);
      let countRight = countSameTypeAnimals(Animal, 1, 0);

      let countHoriz = countLeft + countRight + 1;
      let countVert = countUp + countDown + 1;

      if (countVert >= MATCH_MIN) {
        killAnimalRange(Animal.posX, Animal.posY - countUp, Animal.posX, Animal.posY + countDown);
        canKill = true;
      }

      if (countHoriz >= MATCH_MIN) {
        killAnimalRange(Animal.posX - countLeft, Animal.posY, Animal.posX + countRight, Animal.posY);
        canKill = true;
      }

      return canKill;

    }

    // kill all Animals from a starting position to an end position
    function killAnimalRange(fromX, fromY, toX, toY)
    {

      fromX = Phaser.Math.clamp(fromX, 0, BOARD_COLS - 1);
      fromY = Phaser.Math.clamp(fromY, 0, BOARD_ROWS - 1);
      toX = Phaser.Math.clamp(toX, 0, BOARD_COLS - 1);
      toY = Phaser.Math.clamp(toY, 0, BOARD_ROWS - 1);

      for (let i = fromX; i <= toX; i++) {
        for (let j = fromY; j <= toY; j++) {
          let Animal = getAnimal(i, j);
          Animal.kill();
        }
      }

    }

    // move Animals that have been killed off the board
    function removeKilledAnimals()
    {

      animals.forEach(function (Animal) {
        if (!Animal.alive) {
          setAnimalPos(Animal, -1, -1);
          that.score++;
        }
      });

    }

    // animated Animal movement
    function tweenAnimalPos(Animal, newPosX, newPosY, durationMultiplier)
    {


      return game.add.tween(Animal).to({
        x: newPosX * IMG_SIZE_SPACED,
        y: newPosY * IMG_SIZE_SPACED
      }, 100 * durationMultiplier, Phaser.Easing.Linear.None, true);

    }

    // look for Animals with empty space beneath them and move them down
    function dropAnimals()
    {

      let dropRowCountMax = 0;

      for (let i = 0; i < BOARD_COLS; i++) {
        let dropRowCount = 0;

        for (let j = BOARD_ROWS - 1; j >= 0; j--) {
          let Animal = getAnimal(i, j);

          if (Animal === null) {
            dropRowCount++;
          } else if (dropRowCount > 0) {
            Animal.dirty = true;
            setAnimalPos(Animal, Animal.posX, Animal.posY + dropRowCount);
            tweenAnimalPos(Animal, Animal.posX, Animal.posY, dropRowCount);
          }
        }

        dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
      }

      return dropRowCountMax;

    }

    // look for any empty spots on the board and spawn new Animals in their place that fall down from above
    function refillBoard()
    {

      let maxAnimalsMissingFromCol = 0;

      for (let i = 0; i < BOARD_COLS; i++) {
        let AnimalsMissingFromCol = 0;

        for (let j = BOARD_ROWS - 1; j >= 0; j--) {
          let Animal = getAnimal(i, j);

          if (Animal === null) {
            AnimalsMissingFromCol++;
            Animal = animals.getFirstDead();
            Animal.reset(i * IMG_SIZE_SPACED, -AnimalsMissingFromCol * IMG_SIZE_SPACED);
            Animal.dirty = true;
            randomizeAnimalType(Animal);
            setAnimalPos(Animal, i, j);
            tweenAnimalPos(Animal, Animal.posX, Animal.posY, AnimalsMissingFromCol * 2);
          }
        }

        maxAnimalsMissingFromCol = Math.max(maxAnimalsMissingFromCol, AnimalsMissingFromCol);
      }

      game.time.events.add(maxAnimalsMissingFromCol * 2 * 100, boardRefilled);

    }

    // when the board has finished refilling, re-enable player input
    function boardRefilled()
    {
      let canKill = false;
      for (let i = 0; i < BOARD_COLS; i++) {
        for (let j = BOARD_ROWS - 1; j >= 0; j--) {
          let Animal = getAnimal(i, j);

          if (Animal.dirty) {
            Animal.dirty = false;
            canKill = checkAndKillAnimalMatches(Animal) || canKill;
          }
        }
      }

      if (canKill) {
        removeKilledAnimals();
        let dropAnimalDuration = dropAnimals();
        // delay board refilling until all existing Animals have dropped down
        game.time.events.add(dropAnimalDuration * 100, refillBoard);
        allowInput = false;
      } else {
        allowInput = true;
      }
    }
  }
}
