---
title: socket地址api
date: 2023-03-16
permalink: /posts/2023/03/socket地址api/
tags:
  - TCP/IP网络编程
---
# socket地址API

## 主机字节序和网络字节序

字节序分为大端字节序$(big \quad endian)$和小端字节序$(little \quad endian)$。

大端字节序是指一 个整数的高位字节（23～31 bit）存储在内存的低地址处，低位字节（0 ～7 bit）存储在内存的高地址处。

小端字节序则是指整数的高位字节存 储在内存的高地址处，而低位字节则存储在内存的低地址处。

现代PC大多采用小端字节序，因此**小端字节序又被称为主机字节序**。**大端字节序也称为网络字节序**。

JAVA虚拟机采用大端字节序。

```cpp
#include＜netinet/in.h＞ 
unsigned long int htonl(unsigned long int hostlong); 
unsigned short int htons(unsigned short int hostshort); 
unsigned long int ntohl(unsigned long int netlong); 
unsigned short int ntohs(unsigned short int netshort);
```

## 通用socket地址

socket网络编程接口中表示socket地址的是结构体$sockaddr$

```cpp
#include <sys/socket.h>
struct sockaddr
{
    sa_family_t sa_family;
    char sa_data[14];
}
```

$sa\underline{}family$成员是地址族类型（$sa\underline{}family\underline{}t$）的变量。

|  协议族  |  地址族  |       描述       |
| :------: | :------: | :--------------: |
| PF_UNIX | AF_UNIX | UNIX本地域协议族 |
| PF_INET | AF_INET |  TCP/IPv4协议族  |
| PF_INET6 | AF_INET6 |  TCP/IPv6协议族  |

sa_data成员用于存放socket地址值。

通用socket地址结构体。

```cpp
#include＜bits/socket.h＞ 
struct sockaddr_storage 
{ 
    sa_family_t sa_family; 
    unsigned long int__ss_align; //内存对齐
    char__ss_padding[128-sizeof(__ss_align)];
}
```

## 专用socket地址

UNIX本地域协议族使用如下专用socket地址结构体：

```cpp
#include＜sys/un.h＞ 
struct sockaddr_un 
{ 
    sa_family_t sin_family;/*地址族：AF_UNIX*/ 
    char sun_path[108];/*文件路径名*/ 
};
```

TCP/IP协议族有sockaddr_in和sockaddr_in6两个专用socket地址结构体，它们分别用于IPv4和IPv6：

```cpp
struct sockaddr_in 
{ 
    sa_family_t sin_family;/*地址族：AF_INET*/ 
    u_int16_t sin_port;/*端口号，要用网络字节序表示*/ 
    struct in_addr sin_addr;/*IPv4地址结构体，见下面*/ 
}; 
struct in_addr 
{ 
    u_int32_t s_addr;/*IPv4地址，要用网络字节序表示*/ 
}; 
struct sockaddr_in6 
{ 
    sa_family_t sin6_family;/*地址族：AF_INET6*/
    u_int16_t sin6_port;/*端口号，要用网络字节序表示*/
    u_int32_t sin6_flowinfo;/*流信息，应设置为0*/ 
    struct in6_addr sin6_addr;/*IPv6地址结构体，见下面*/ 
    u_int32_t sin6_scope_id;/*scope ID，尚处于实验阶段*/ 
}; 
struct in6_addr 
{ 
    unsigned char sa_addr[16];/*IPv6地址，要用网络字节序表示*/ 
};
```

所有专用socket地址（以及sockaddr_storage）类型的变量在实际使 用时都需要转化为通用socket地址类型sockaddr（强制转换即可），因 为所有socket编程接口使用的地址参数的类型都是sockaddr。

## IP地址转换函数

```cpp
#include＜arpa/inet.h＞ 
in_addr_t inet_addr(const char*strptr); 
int inet_aton(const char*cp,struct in_addr*inp); 
char*inet_ntoa(struct in_addr in);
```

inet_addr和inet_addr函数将用点分十进制字符串表示的IPv4地址转化为用网络 字节序整数表示的IPv4地址

inet_ntoa函数将用网络字节序整数表示的IPv4地址转化为用点分十 进制字符串表示的IPv4地址。但需要注意的是，该函数内部用一个静 态变量存储转化结果，函数的返回值指向该静态内存，因此inet_ntoa是 不可重入的。

下面这对更新的函数也能完成和前面3个函数同样的功能，并且它 们同时适用于IPv4地址和IPv6地址：

```cpp
#include＜arpa/inet.h＞ 
int inet_pton(int af,const char*src,void*dst); 
const char*inet_ntop(int af,const void*src,char*dst,socklen_t cnt);
```

inet_pton函数将用字符串表示的IP地址src（用点分十进制字符串表 示的IPv4地址或用十六进制字符串表示的IPv6地址）转换成用网络字节 序整数表示的IP地址，并把**转换结果存储于dst指向的内存中**。其中，af 参数指定地址族，可以是AF_INET或者AF_INET6。inet_pton成功时返 回1，失败则返回0并设置errno。

inet_ntop函数进行相反的转换，前三个参数的含义与inet_pton的参 数相同，**最后一个参数cnt指定目标存储单元dst的大小**。下面的两个宏能 帮助我们指定这个大小（分别用于IPv4和IPv6）：

```cpp
#include＜netinet/in.h＞ 
#define INET_ADDRSTRLEN 16 
#define INET6_ADDRSTRLEN 46
```
