class Vehicle:
    def __init__(self, position, max_speed, size):
        self.position = position
        self.max_speed = max_speed
        self.size = size
        self.speed = 0

    def travel(self, new_position, speed):
        if speed <= self.max_speed:
            self.position = new_position
            self.speed = speed
        else:
            print("Exceeding maximum speed.")

    def set_speed(self, speed):
        if speed <= self.max_speed:
            self.speed = speed
        else:
            print("Exceeding maximum speed.")


class Car(Vehicle):
    def __init__(self, position, max_speed, size, color, brand):
        super().__init__(position, max_speed, size)
        self.color = color
        self.brand = brand
        self.gear = 'N'

    def change_gear(self, gear):
        if gear in ['R', 'N', 'D']:
            self.gear = gear
        else:
            print("Invalid gear.")

    def honk(self):
        print("Beep beep!")

# Usage:
car = Car((0, 0), 120, (4, 2), "Red", "Toyota")
print(car.position)  # prints: (0, 0)
car.travel((1, 1), 60)
print(car.position)  # prints: (1, 1)
car.set_speed(100)
print(car.speed)  # prints: 100
car.change_gear('D')
print(car.gear)  # prints: D
car.honk()  # prints: Beep beep!