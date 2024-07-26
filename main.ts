/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen
load dependency
"Tinybit": "file:../pxt-Tinybit"
*/
//% color="#585CA9" weight=20 icon="\uf1b9"
namespace Tinybit {
    const PWM_ADD = 0x01
    const MOTOR = 0x02
    const RGB = 0x01

    let yahStrip: neopixel.Strip;
    export enum enColor {
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="Red" block="Red"
        Red,
        //% blockId="Green" block="Green"
        Green,
        //% blockId="Blue" block="Blue"
        Blue,
        //% blockId="White" block="White"
        White,
        //% blockId="Cyan" block="Cyan"
        Cyan,
        //% blockId="Pinkish" block="Pinkish"
        Pinkish,
        //% blockId="Yellow" block="Yellow"
        Yellow,
    }
    export enum enMusic {
        //% blockId="dadadum" block="dadadum"
        dadadum = 0,
        //% blockId="entertainer" block="entertainer"
        entertainer,
        //% blockId="prelude" block="prelude"
        prelude,
        //% blockId="ode" block="ode"
        ode,
        //% blockId="nyan" block="nyan"
        nyan,
        //% blockId="ringtone" block="ringtone"
        ringtone,
        //% blockId="funk" block="funk"
        funk,
        //% blockId="blues" block="blues"
        blues,
        //% blockId="birthday" block="birthday"
        birthday,
        //% blockId="wedding" block="wedding"
        wedding,
        //% blockId="funereal" block="funereal"
        funereal,
        //% blockId="punchline" block="punchline"
        punchline,
        //% blockId="baddy" block="baddy"
        baddy,
        //% blockId="chase" block="chase"
        chase,
        //% blockId="ba_ding" block="ba_ding"
        ba_ding,
        //% blockId="wawawawaa" block="wawawawaa"
        wawawawaa,
        //% blockId="jump_up" block="jump_up"
        jump_up,
        //% blockId="jump_down" block="jump_down"
        jump_down,
        //% blockId="power_up" block="power_up"
        power_up,
        //% blockId="power_down" block="power_down"
        power_down
    }
    export enum enPos {
        //% blockId="LeftState" block="LeftState"
        LeftState = 0,
        //% blockId="RightState" block="RightState"
        RightState = 1
    }
    export enum enLineState {
        //% blockId="White" block="White Line"
        White = 0,
        //% blockId="Black" block="Black Line"
        Black = 1
    }


    export enum CarState {
        //% blockId="Car_Run" block="Run"
        Car_Run = 1,
        //% blockId="Car_Back" block="Back"
        Car_Back = 2,
        //% blockId="Car_Left" block="Left"
        Car_Left = 3,
        //% blockId="Car_Right" block="Right"
        Car_Right = 4,
        //% blockId="Car_Stop" block="Stop"
        Car_Stop = 5,
        //% blockId="Car_SpinLeft" block="SpinLeft"
        Car_SpinLeft = 6,
        //% blockId="Car_SpinRight" block="SpinRight"
        Car_SpinRight = 7
    }
    function setPwmRGB(red: number, green: number, blue: number): void {
        let buf = pins.createBuffer(4);
        buf[0] = RGB;
        buf[1] = red;
        buf[2] = green;
        buf[3] = blue;

        pins.i2cWriteBuffer(PWM_ADD, buf);
    }
    function setPwmMotor(mode: number, speed1: number, speed2: number): void {
        if (mode < 0 || mode > 6)
            return;

        let buf = pins.createBuffer(5);
        buf[0] = MOTOR;
        switch (mode) {
            case 0: buf[1] = 0; buf[2] = 0; buf[3] = 0; buf[4] = 0; break;              //stop
            case 1: buf[1] = speed1; buf[2] = 0; buf[3] = speed2; buf[4] = 0; break;    //run
            case 2: buf[1] = 0; buf[2] = speed1; buf[3] = 0; buf[4] = speed2; break;    //back
            case 3: buf[1] = 0; buf[2] = 0; buf[3] = speed2; buf[4] = 0; break;         //left
            case 4: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = 0; break;         //right
            case 5: buf[1] = 0; buf[2] = speed1; buf[3] = speed2; buf[4] = 0; break;    //tleft
            case 6: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = speed2; break;    //tright
        }
        pins.i2cWriteBuffer(PWM_ADD, buf);
    }
    function stop_the_car(): void {
        let buff = pins.createBuffer(5);
        buff[0] = MOTOR;
        buff[1] = 0; buff[2] = 0; buff[3] = 0; buff[4] = 0;         //stop
        pins.i2cWriteBuffer(PWM_ADD, buff);

    }
    function move_step(): void {
        let buf = pins.createBuffer(5);
        buf[0] = MOTOR;
        //setTimeout(stop_the_car, 5000);
        buf[1] = 100; buf[2] = 0; buf[3] = 100; buf[4] = 0;    //run    
        pins.i2cWriteBuffer(PWM_ADD, buf);
        control.waitMicros(500000);  // 5 seconds
        stop_the_car();
    }

    function move_steps(num_steps: number): void {
        let buf = pins.createBuffer(5);
        buf[0] = MOTOR;
        //setTimeout(stop_the_car, 500*num_steps);
        buf[1] = 100; buf[2] = 0; buf[3] = 100; buf[4] = 0;    //run    
        pins.i2cWriteBuffer(PWM_ADD, buf);
        control.waitMicros(500000 * num_steps);  // 5 seconds
        stop_the_car();
    }
    function Car_run(speed1: number, speed2: number) {
        setPwmMotor(1, speed1, speed2);
    }
    function Car_back(speed1: number, speed2: number) {
        setPwmMotor(2, speed1, speed2);
    }
    function Car_left(speed1: number, speed2: number) {
        setPwmMotor(3, speed1, speed2);
    }
    function Car_right(speed1: number, speed2: number) {
        setPwmMotor(4, speed1, speed2);
    }
    function Car_stop() {

        setPwmMotor(0, 0, 0);
    }
    function Car_spinleft(speed1: number, speed2: number) {
        setPwmMotor(5, speed1, speed2);
    }
    function Car_spinright(speed1: number, speed2: number) {
        setPwmMotor(6, speed1, speed2);
    }
    /**
     * *****************************************************************
     * @param index
     */
    //% blockId=Tinybit_RGB_Car_Program block="RGB_Car_Program"
    //% weight=0
    //% blockGap=10
    //% color="#585CA9"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Car_Program(): neopixel.Strip {

        if (!yahStrip) {
            yahStrip = neopixel.create(DigitalPin.P12, 2, NeoPixelMode.RGB);
        }
        return yahStrip;
    }
    //% blockId=one_step_forward block="one_step_forward"
    //% weight=1
    //% blockGap=10
    //% color="#585CA9"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function one_step_forward(): void {

        move_step();
    }

    //% blockId=Move_Steps block="Move_Steps|n_steps %n_steps"
    //% weight=2
    //% blockGap=10
    //% color="#585CA9"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Move_Steps(n_steps: number): void {

        move_steps(n_steps);
    }

    //% blockId=Tinybit_RGB_Car_Big block="Light Color %value"
    //% weight=3
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Car_Big(value: enColor): void {
        switch (value) {
            case enColor.OFF: {
                setPwmRGB(0, 0, 0);
                break;
            }
            case enColor.Red: {
                setPwmRGB(255, 0, 0);
                break;
            }
            case enColor.Green: {
                setPwmRGB(0, 255, 0);
                break;
            }
            case enColor.Blue: {
                setPwmRGB(0, 0, 255);
                break;
            }
            case enColor.White: {
                setPwmRGB(255, 255, 255);
                break;
            }
            case enColor.Cyan: {
                setPwmRGB(0, 255, 255);
                break;
            }
            case enColor.Pinkish: {
                setPwmRGB(255, 0, 255);
                break;
            }
            case enColor.Yellow: {
                setPwmRGB(255, 255, 0);
                break;
            }
        }
    }
    //% blockId=Tinybit_RGB_Car_Big2 block="Light Color|Red %Red|Green %Green|Blue %Blue"
    //% weight=4
    //% blockGap=10
    //% Red.min=0 Red.max=255 Green.min=0 Green.max=255 Blue.min=0 Blue.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Car_Big2(Red: number, Green: number, Blue: number): void {
        setPwmRGB(Red, Green, Blue);
    }

    //% blockId=Tinybit_Music_Car block="Music_Car|%index"
    //% weight=11
    //% blockGap=10
    //% color="#585CA9"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Music_Car(index: enMusic): void {
        switch (index) {
            case enMusic.dadadum: music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once); break;
            case enMusic.birthday: music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once); break;
            case enMusic.entertainer: music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once); break;
            case enMusic.prelude: music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once); break;
            case enMusic.ode: music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once); break;
            case enMusic.nyan: music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once); break;
            case enMusic.ringtone: music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once); break;
            case enMusic.funk: music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once); break;
            case enMusic.blues: music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once); break;
            case enMusic.wedding: music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once); break;
            case enMusic.funereal: music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once); break;
            case enMusic.punchline: music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once); break;
            case enMusic.baddy: music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once); break;
            case enMusic.chase: music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once); break;
            case enMusic.ba_ding: music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once); break;
            case enMusic.wawawawaa: music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once); break;
            case enMusic.jump_up: music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once); break;
            case enMusic.jump_down: music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once); break;
            case enMusic.power_up: music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once); break;
            case enMusic.power_down: music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once); break;
        }
    }



    //% blockId=Tinybit_CarCtrl block="CarCtrl|%index"
    //% weight=5
    //% blockGap=10
    //% color="#585CA9"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrl(index: CarState): void {
        switch (index) {
            case CarState.Car_Run: Car_run(255, 255); break;
            case CarState.Car_Back: Car_back(255, 255); break;
            case CarState.Car_Left: Car_left(255, 255); break;
            case CarState.Car_Right: Car_right(255, 255); break;
            case CarState.Car_Stop: Car_stop(); break;
            case CarState.Car_SpinLeft: Car_spinleft(255, 255); break;
            case CarState.Car_SpinRight: Car_spinright(255, 255); break;
        }
    }

    //% blockId=Tinybit_CarCtrlSpeed block="CarCtrlSpeed|%index|speed %speed"
    //% weight=6
    //% blockGap=10
    //% speed.min=0 speed.max=255
    //% color="#585CA9"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrlSpeed(index: CarState, speed: number): void {
        switch (index) {
            case CarState.Car_Run: Car_run(speed, speed); break;
            case CarState.Car_Back: Car_back(speed, speed); break;
            case CarState.Car_Left: Car_left(speed, speed); break;
            case CarState.Car_Right: Car_right(speed, speed); break;
            case CarState.Car_Stop: Car_stop(); break;
            case CarState.Car_SpinLeft: Car_spinleft(speed, speed); break;
            case CarState.Car_SpinRight: Car_spinright(speed, speed); break;
        }
    }

    //% blockId=Tinybit_CarCtrlSpeed2 block="CarCtrlSpeed2|%index|speed1 %speed1|speed2 %speed2"
    //% weight=7
    //% blockGap=10
    //% speed1.min=0 speed1.max=255 speed2.min=0 speed2.max=255
    //% color="#585CA9"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrlSpeed2(index: CarState, speed1: number, speed2: number): void {
        switch (index) {
            case CarState.Car_Run: Car_run(speed1, speed2); break;
            case CarState.Car_Back: Car_back(speed1, speed2); break;
            case CarState.Car_Left: Car_left(speed1, speed2); break;
            case CarState.Car_Right: Car_right(speed1, speed2); break;
            case CarState.Car_Stop: Car_stop(); break;
            case CarState.Car_SpinLeft: Car_spinleft(speed1, speed2); break;
            case CarState.Car_SpinRight: Car_spinright(speed1, speed2); break;
        }
    }



    //% blockId=Tinybit_Line_Sensor block="Line Sensor Detector %direct|value %value"
    //% weight=8
    //% blockGap=10
    //% color="#585CA9"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Line_Sensor(direct: enPos, value: enLineState): boolean {
        let temp: boolean = false;
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
        switch (direct) {
            case enPos.LeftState: {
                if (pins.digitalReadPin(DigitalPin.P13) == value) {
                    temp = true;
                }
                else {
                    temp = false;
                }
                break;
            }
            case enPos.RightState: {
                if (pins.digitalReadPin(DigitalPin.P14) == value) {
                    temp = true;
                }
                else {
                    temp = false;
                }
                break;
            }
        }
        return temp;
    }
    //% blockId=Tinybit_Voice_Sensor block="Voice Sensor return"
    //% weight=9
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Voice_Sensor(): number {
        //pins.setPull(DigitalPin.P1, PinPullMode.PullUp);
        let temp = 0;
        temp = pins.analogReadPin(AnalogPin.P1);

        return temp;
    }

    //% blockId=Tinybit_Ultrasonic_Car block="ultrasonic return distance(cm)"
    //% color="#585CA9"
    //% weight=10
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic_Car(): number {
        let list: Array<number> = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            pins.setPull(DigitalPin.P16, PinPullMode.PullNone);
            pins.digitalWritePin(DigitalPin.P16, 0);
            control.waitMicros(2);
            pins.digitalWritePin(DigitalPin.P16, 1);
            control.waitMicros(15);
            pins.digitalWritePin(DigitalPin.P16, 0);
            let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 43200);
            list[i] = Math.floor(d / 40);
        }
        list.sort();
        let length = (list[1] + list[2] + list[3]) / 3;
        return Math.floor(length);
    }
    export enum MoveDirection {
        //% block="forward"
        Forward,
        //% block="backward"
        Backward,
        //% block="left"
        Left,
        //% block="right"
        Right
    }

    //% blockId=move_robot block="move robot %direction|for %time ms"
    //% weight=100
    //% blockGap=10
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=4
    export function moveRobot(direction: MoveDirection, time: number): void {
        // Set motors to move in the chosen direction
        switch (direction) {
            case MoveDirection.Forward:
                setPwmMotor(1, 100, 100); // Move forward
                break;
            case MoveDirection.Backward:
                setPwmMotor(2, 100, 100); // Move backward
                break;
            case MoveDirection.Left:
                setPwmMotor(3, 100, 100); // Move left
                break;
            case MoveDirection.Right:
                setPwmMotor(4, 100, 100); // Move right
                break;
        }
        control.waitMicros(time * 1000); // Wait for the specified time
        setPwmMotor(0, 0, 0); // Stop the robot
    }

    export enum TurnDirection {
        //% block="left"
        Left,
        //% block="right"
        Right
    }
    //% blockId=turn_robot block="turn robot %direction|"
    //% weight=98
    //% blockGap=10
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=4
    export function turnRobot(direction: TurnDirection): void {
        let turnTime = 500; // Adjust this value based on your robot's turning speed and calibration
        if (direction === TurnDirection.Left) {
            setPwmMotor(3, 100, 100); // Turn left
        } else if (direction === TurnDirection.Right) {
            setPwmMotor(4, 100, 100); // Turn right
        }
        control.waitMicros(turnTime * 1000); // Wait for the specified time
        setPwmMotor(0, 0, 0); // Stop the robot
    }


    // Function to turn the robot by a specific angle
    //% blockId=turn_robot_angle block="Turn robot %direction by %angle degrees"
    //% weight=100
    //% angle.min=0 angle.max=360
    //% blockGap=10
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=4
    export function turnRobotByAngle(direction: TurnDirection, angle: number): void {
        let turnTimePer90Degrees = 500; // Time to turn 90 degrees
        let turnTime = (angle / 90) * turnTimePer90Degrees; // Calculate time for the specified angle

        if (direction === TurnDirection.Left) {
            setPwmMotor(3, 100, 100); // Turn left
        } else if (direction === TurnDirection.Right) {
            setPwmMotor(4, 100, 100); // Turn right
        }
        control.waitMicros(turnTime * 1000); // Wait for the calculated time
        setPwmMotor(0, 0, 0); // Stop the robot
    }


    
    //% blockId=stop_robot block="stop robot"
    //% weight=99
    //% blockGap=10
    //% color="#FF5733"
    export function stopRobot(): void {
        setPwmMotor(0, 0, 0); // Stop all motors
    }
}
