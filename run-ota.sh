adb tcpip 5555
unset ANDROID_SERIAL
adb reverse tcp:8081 tcp:8081
adb connect 192.168.52.73:5555
export ANDROID_SERIAL=192.168.52.73:5555
