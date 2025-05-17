---
layout: page
title: C++ 멀티스레딩 기초(Multithreading Basics)
description: >
  C++11의 스레드 라이브러리, 동기화 메커니즘, 동시성 프로그래밍의 기본 개념과 패턴
hide_description: false
---

## 핵심 개념

### 스레드와 프로세스

**프로세스(Process)**는 실행 중인 프로그램의 인스턴스로, 독립된 메모리 공간을 가집니다. **스레드(Thread)**는 프로세스 내에서 실행되는 작업 단위로, 같은 프로세스의 스레드들은 메모리 공간을 공유합니다.

C++11부터 표준 라이브러리에 스레드 지원이 추가되었으며, `<thread>` 헤더를 통해 사용할 수 있습니다.

### 스레드 생성과 실행

C++에서 스레드를 생성하는 기본 방법입니다:

```cpp
#include <thread>
#include <iostream>

// 스레드로 실행할 함수
void threadFunction() {
    std::cout << "스레드에서 실행 중...\n";
}

int main() {
    // 스레드 생성 및 시작
    std::thread t(threadFunction);
    
    // 메인 스레드에서 실행
    std::cout << "메인 스레드에서 실행 중...\n";
    
    // 스레드 종료 대기
    t.join();
    
    return 0;
}
```

### 스레드 동기화 메커니즘

#### 뮤텍스(Mutex)

뮤텍스는 상호 배제(Mutual Exclusion)를 위한 동기화 기본 도구입니다. 공유 자원에 대한 접근을 직렬화하여 데이터 경쟁 상태를 방지합니다.

```cpp
#include <mutex>
#include <thread>
#include <iostream>

std::mutex mtx;  // 뮤텍스 객체
int sharedValue = 0;  // 공유 자원

void incrementValue(int count) {
    for (int i = 0; i < count; ++i) {
        mtx.lock();  // 뮤텍스 잠금
        ++sharedValue;  // 공유 자원 수정
        mtx.unlock();  // 뮤텍스 해제
    }
}

int main() {
    std::thread t1(incrementValue, 1000);
    std::thread t2(incrementValue, 1000);
    
    t1.join();
    t2.join();
    
    std::cout << "최종 값: " << sharedValue << std::endl;  // 2000 출력
    
    return 0;
}
```

#### 락 가드(Lock Guard)

자원 획득 초기화(RAII) 원칙을 따르는 뮤텍스 래퍼로, 스코프를 벗어날 때 자동으로 뮤텍스를 해제합니다.

```cpp
void incrementValueSafe(int count) {
    for (int i = 0; i < count; ++i) {
        std::lock_guard<std::mutex> lock(mtx);  // 생성자에서 잠금
        ++sharedValue;
    }  // 스코프를 벗어나면 소멸자에서 자동 해제
}
```

#### 조건 변수(Condition Variable)

조건 변수는 스레드 간 시그널링 메커니즘으로, 한 스레드가 특정 조건이 충족될 때까지 대기하고, 다른 스레드가 조건이 충족되면 대기 중인 스레드에 알리는 데 사용됩니다.

```cpp
#include <condition_variable>
#include <mutex>
#include <thread>
#include <queue>
#include <iostream>

std::mutex mtx;
std::condition_variable cv;
std::queue<int> tasks;
bool finished = false;

// 생산자 스레드
void producer() {
    for (int i = 0; i < 10; ++i) {
        {
            std::lock_guard<std::mutex> lock(mtx);
            tasks.push(i);
            std::cout << "작업 생성: " << i << std::endl;
        }
        cv.notify_one();  // 대기 중인 소비자에게 알림
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
    
    {
        std::lock_guard<std::mutex> lock(mtx);
        finished = true;
    }
    cv.notify_one();
}

// 소비자 스레드
void consumer() {
    while (true) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, []{ return !tasks.empty() || finished; });
        
        if (tasks.empty() && finished) {
            break;
        }
        
        int task = tasks.front();
        tasks.pop();
        lock.unlock();
        
        // 작업 처리
        std::cout << "작업 처리: " << task << std::endl;
    }
}

int main() {
    std::thread t1(producer);
    std::thread t2(consumer);
    
    t1.join();
    t2.join();
    
    return 0;
}
```

### 데이터 경쟁(Data Race)과 경쟁 조건(Race Condition)

**데이터 경쟁**은 두 개 이상의 스레드가 동시에 같은 메모리 위치에 접근하고, 그 중 하나 이상이 쓰기 작업을 수행할 때 발생합니다. 이는 정의되지 않은 동작을 유발할 수 있습니다.

**경쟁 조건**은 두 개 이상의 연산이 특정 순서로 실행되어야 하는데, 그 순서가 보장되지 않아 발생하는 버그입니다.

### 원자적 연산(Atomic Operations)

C++11은 원자적 연산을 위한 `<atomic>` 헤더를 제공합니다. 이를 통해 뮤텍스 없이도 단순한 스레드 안전 연산을 수행할 수 있습니다.

```cpp
#include <atomic>
#include <thread>
#include <iostream>

std::atomic<int> counter(0);  // 원자적 변수

void increment(int count) {
    for (int i = 0; i < count; ++i) {
        counter++;  // 원자적 증가
    }
}

int main() {
    std::thread t1(increment, 1000);
    std::thread t2(increment, 1000);
    
    t1.join();
    t2.join();
    
    std::cout << "최종 값: " << counter << std::endl;  // 항상 2000
    
    return 0;
}
```

### 스레드 로컬 저장소(Thread Local Storage)

`thread_local` 키워드를 사용하면 각 스레드에 고유한 변수를 생성할 수 있습니다.

```cpp
#include <thread>
#include <iostream>

thread_local int threadValue = 0;  // 각 스레드마다 다른 인스턴스

void threadFunction(int val) {
    threadValue = val;  // 해당 스레드의 복사본만 수정
    std::cout << "스레드 " << val << "의 값: " << threadValue << std::endl;
}

int main() {
    std::thread t1(threadFunction, 1);
    std::thread t2(threadFunction, 2);
    
    t1.join();
    t2.join();
    
    std::cout << "메인 스레드의 값: " << threadValue << std::endl;  // 0 출력
    
    return 0;
}
```

## 실용적인 예제

### 예제 1: 병렬 처리를 통한 성능 향상

```cpp
#include <thread>
#include <vector>
#include <iostream>
#include <chrono>
#include <numeric>
#include <functional>

// 일련의 숫자 합계 계산 함수
void sumRange(const std::vector<int>& data, size_t start, size_t end, uint64_t& result) {
    result = 0;
    for (size_t i = start; i < end; ++i) {
        result += data[i];
    }
}

int main() {
    // 큰 데이터 생성
    const size_t dataSize = 100'000'000;
    std::vector<int> data(dataSize, 1);  // 모두 1로 초기화
    
    // 단일 스레드 방식 (기준 측정)
    auto start = std::chrono::high_resolution_clock::now();
    
    uint64_t singleThreadSum = 0;
    sumRange(data, 0, dataSize, singleThreadSum);
    
    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double> singleThreadTime = end - start;
    
    std::cout << "단일 스레드 합계: " << singleThreadSum << std::endl;
    std::cout << "실행 시간: " << singleThreadTime.count() << "초" << std::endl;
    
    // 다중 스레드 방식
    start = std::chrono::high_resolution_clock::now();
    
    const size_t numThreads = std::thread::hardware_concurrency();  // 하드웨어 지원 스레드 수
    std::vector<std::thread> threads(numThreads);
    std::vector<uint64_t> partialSums(numThreads);
    
    // 작업 분할 및 스레드 생성
    size_t chunkSize = dataSize / numThreads;
    for (size_t i = 0; i < numThreads; ++i) {
        size_t startIdx = i * chunkSize;
        size_t endIdx = (i == numThreads - 1) ? dataSize : (i + 1) * chunkSize;
        threads[i] = std::thread(sumRange, std::ref(data), startIdx, endIdx, std::ref(partialSums[i]));
    }
    
    // 모든 스레드 완료 대기
    for (auto& t : threads) {
        t.join();
    }
    
    // 부분 합계 결합
    uint64_t multiThreadSum = std::accumulate(partialSums.begin(), partialSums.end(), 0ULL);
    
    end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double> multiThreadTime = end - start;
    
    std::cout << "다중 스레드(" << numThreads << "개) 합계: " << multiThreadSum << std::endl;
    std::cout << "실행 시간: " << multiThreadTime.count() << "초" << std::endl;
    std::cout << "속도 향상: " << singleThreadTime.count() / multiThreadTime.count() << "배" << std::endl;
    
    return 0;
}
```

### 예제 2: 스레드 풀 구현

```cpp
#include <thread>
#include <queue>
#include <functional>
#include <mutex>
#include <condition_variable>
#include <vector>
#include <iostream>
#include <future>

class ThreadPool {
public:
    ThreadPool(size_t numThreads) : stop(false) {
        for (size_t i = 0; i < numThreads; ++i) {
            workers.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    
                    {
                        std::unique_lock<std::mutex> lock(queueMutex);
                        condition.wait(lock, [this] { return stop || !tasks.empty(); });
                        
                        if (stop && tasks.empty()) {
                            return;
                        }
                        
                        task = std::move(tasks.front());
                        tasks.pop();
                    }
                    
                    task();
                }
            });
        }
    }
    
    template<class F, class... Args>
    auto enqueue(F&& f, Args&&... args) -> std::future<typename std::invoke_result<F, Args...>::type> {
        using return_type = typename std::invoke_result<F, Args...>::type;
        
        auto task = std::make_shared<std::packaged_task<return_type()>>(
            std::bind(std::forward<F>(f), std::forward<Args>(args)...)
        );
        
        std::future<return_type> result = task->get_future();
        
        {
            std::unique_lock<std::mutex> lock(queueMutex);
            if (stop) {
                throw std::runtime_error("ThreadPool 작업 추가 불가: 종료 중");
            }
            
            tasks.emplace([task]() { (*task)(); });
        }
        
        condition.notify_one();
        return result;
    }
    
    ~ThreadPool() {
        {
            std::unique_lock<std::mutex> lock(queueMutex);
            stop = true;
        }
        
        condition.notify_all();
        
        for (std::thread& worker : workers) {
            worker.join();
        }
    }
    
private:
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;
    
    std::mutex queueMutex;
    std::condition_variable condition;
    bool stop;
};

// 스레드 풀 사용 예제
int main() {
    ThreadPool pool(4);  // 4개의 스레드로 풀 생성
    
    // 결과를 저장할 future 객체들
    std::vector<std::future<int>> results;
    
    // 작업 추가
    for (int i = 0; i < 8; ++i) {
        auto result = pool.enqueue([i] {
            std::cout << "작업 " << i << " 실행 중 (스레드 ID: "
                      << std::this_thread::get_id() << ")\n";
            std::this_thread::sleep_for(std::chrono::seconds(1));
            return i * i;
        });
        
        results.push_back(std::move(result));
    }
    
    // 결과 수집
    for (auto& result : results) {
        std::cout << "결과: " << result.get() << std::endl;
    }
    
    return 0;
}
```

### 예제 3: 데드락 방지와 해결 방법

```cpp
#include <thread>
#include <mutex>
#include <iostream>
#include <chrono>

// 데드락이 발생할 수 있는 코드
void deadlockExample() {
    std::mutex mutex1, mutex2;
    
    std::thread t1([&mutex1, &mutex2] {
        std::cout << "스레드 1: mutex1 잠금 시도\n";
        std::lock_guard<std::mutex> lock1(mutex1);
        
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        
        std::cout << "스레드 1: mutex2 잠금 시도\n";
        std::lock_guard<std::mutex> lock2(mutex2);
        
        std::cout << "스레드 1: 두 뮤텍스 모두 잠금 성공\n";
    });
    
    std::thread t2([&mutex1, &mutex2] {
        std::cout << "스레드 2: mutex2 잠금 시도\n";
        std::lock_guard<std::mutex> lock2(mutex2);
        
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        
        std::cout << "스레드 2: mutex1 잠금 시도\n";
        std::lock_guard<std::mutex> lock1(mutex1);
        
        std::cout << "스레드 2: 두 뮤텍스 모두 잠금 성공\n";
    });
    
    t1.join();
    t2.join();
}

// std::lock을 사용한 데드락 방지 예제
void deadlockSolutionExample() {
    std::mutex mutex1, mutex2;
    
    std::thread t1([&mutex1, &mutex2] {
        std::cout << "스레드 1: 두 뮤텍스 동시 잠금 시도\n";
        std::scoped_lock lock(mutex1, mutex2);  // C++17
        // 또는 C++11에서: std::lock(mutex1, mutex2); std::lock_guard<std::mutex> lock1(mutex1, std::adopt_lock); std::lock_guard<std::mutex> lock2(mutex2, std::adopt_lock);
        
        std::cout << "스레드 1: 두 뮤텍스 모두 잠금 성공\n";
    });
    
    std::thread t2([&mutex1, &mutex2] {
        std::cout << "스레드 2: 두 뮤텍스 동시 잠금 시도\n";
        std::scoped_lock lock(mutex1, mutex2);  // C++17
        
        std::cout << "스레드 2: 두 뮤텍스 모두 잠금 성공\n";
    });
    
    t1.join();
    t2.join();
}

int main() {
    std::cout << "데드락 가능성 있는 코드 실행:\n";
    // deadlockExample();  // 주석 처리: 실제로 실행하면 데드락 발생
    
    std::cout << "\n데드락 방지 코드 실행:\n";
    deadlockSolutionExample();
    
    return 0;
}
```

## 자주 묻는 인터뷰 질문

1. **Q: C++에서 스레드를 생성하는 방법은?**
   
   A: C++11부터 `<thread>` 헤더의 `std::thread` 클래스를 사용합니다:
   ```cpp
   std::thread t(함수명, 매개변수1, 매개변수2, ...);
   ```

2. **Q: `join()`과 `detach()`의 차이점은 무엇인가요?**
   
   A: `join()`은 스레드가 완료될 때까지 현재 스레드(주로 메인 스레드)가 대기합니다. `detach()`는 스레드를 백그라운드로 분리하여 독립적으로 실행되게 합니다. 분리된 스레드는 더 이상 `std::thread` 객체에서 관리되지 않습니다.

3. **Q: 데이터 경쟁(Data Race)과 경쟁 조건(Race Condition)의 차이점은?**
   
   A: 데이터 경쟁은 동일한 메모리 위치에 동시 접근할 때 발생하는 기술적 문제이며, 정의되지 않은 동작을 초래합니다. 경쟁 조건은 작업의 타이밍이나 순서에 의존하는 로직적 버그로, 동기화로 해결할 수 있습니다.

4. **Q: 뮤텍스와 세마포어의 차이점은?**
   
   A: 뮤텍스는 한 번에 하나의 스레드만 리소스에 접근할 수 있게 하는 이진(0 또는 1) 상태를 가집니다. 세마포어는 여러 스레드가 동시에 접근할 수 있는 제한된 수의 접근을 허용하는 카운팅 메커니즘입니다.

5. **Q: C++에서 데드락을 방지하는 방법은?**
   
   A: 데드락 방지 방법에는 다음이 있습니다:
   - 항상 동일한 순서로 뮤텍스를 잠금
   - `std::lock` 또는 C++17의 `std::scoped_lock`을 사용하여 여러 뮤텍스를 원자적으로 잠금
   - 계층적 뮤텍스 전략 사용
   - 잠금 타임아웃 구현 (`std::try_lock`)
   - 가능한 경우 잠금 없는 자료구조 사용

6. **Q: 조건 변수는 어떤 상황에서 유용한가요?**
   
   A: 조건 변수는 다음과 같은 상황에서 유용합니다:
   - 생산자-소비자 패턴 구현
   - 작업 완료를 기다릴 때
   - 스레드가 특정 이벤트나 조건 발생을 기다려야 할 때
   - 주기적 작업 예약

7. **Q: `std::async`의 주요 용도는 무엇인가요?**
   
   A: `std::async`는 비동기 태스크를 실행하고 결과를 `std::future`를 통해 가져오는 편리한 방법을 제공합니다. 다음과 같은 용도로 사용됩니다:
   - 비동기 연산의 결과를 기다릴 때
   - 예외 전파가 필요한 비동기 작업
   - 실행 정책(execution policy)을 지정하여 태스크의 실행 방식 제어

8. **Q: C++에서 원자적 연산이란 무엇이며 어떻게 사용하나요?**
   
   A: 원자적 연산은 중간 상태 없이 전체가 한 번에 실행되는 연산입니다. C++에서는 `<atomic>` 헤더의 `std::atomic` 템플릿을 사용합니다:
   ```cpp
   std::atomic<int> counter(0);
   counter++;  // 원자적 증가
   counter.fetch_add(5, std::memory_order_relaxed);  // 메모리 순서 지정 가능
   ```

## 실무 활용 팁

### 멀티스레딩 디버깅 기법

1. **로깅**: 스레드 ID와 함께 로깅하여 각 스레드의 동작 추적
2. **경쟁 조건 감지 도구**: Valgrind의 Helgrind나 ThreadSanitizer 사용
3. **스레드 시각화 도구**: Intel Parallel Studio의 Thread Profiler, Visual Studio의 성능 프로파일러 등

### 성능 최적화 팁

1. **스레드 풀 사용**: 스레드 생성 비용 감소를 위해 스레드 풀 사용
2. **작업 분할**: 작업을 적절한 크기로 분할하여 부하 균형 유지
3. **캐시 지역성 고려**: 스레드별로 처리할 데이터를 캐시 친화적으로 구성
4. **잠금 시간 최소화**: 중요 섹션을 최대한 작게 유지
5. **원자적 연산 활용**: 가능한 경우 뮤텍스 대신 원자적 연산 사용

### 스레드 안전성 확보 방법

1. **불변성 활용**: 가능한 경우 데이터를 수정 불가능하게 설계
2. **스레드 지역 변수 사용**: 공유 상태를 최소화
3. **RAII 패턴 활용**: 자원의 안전한 획득과 해제를 보장
4. **잠금 계층 구조 정의**: 잠금 순서를 명확히 하여 데드락 방지
5. **락 없는 자료구조 고려**: 성능이 중요한 경우 락 없는(lock-free) 자료구조 사용

### 실용적인 동시성 패턴

1. **생산자-소비자 패턴**: 작업 큐를 통한 비동기 처리
2. **병렬 맵-리듀스**: 데이터를 분할하여 병렬 처리 후 결과 합산
3. **파이프라인 패턴**: 연속된 처리 단계를 병렬화
4. **작업-훔치기(Work-stealing)**: 유휴 스레드가 다른 스레드의 작업을 훔쳐 처리
5. **액터 모델(Actor Model)**: 독립적인 액터가 메시지를 주고받는 병렬 처리 방식 