import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
// import PerfectScrollbar from 'perfect-scrollbar';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, LineController } from 'chart.js';
import { Signin } from '../user/signin/signin';
import { MapComponent } from '../shared/map-component/map-component';
import { UserService } from '../../Services/User/user-service';
import { Navbar } from "../shared/navbar/navbar";
import { Sidebar } from '../shared/sidebar/sidebar';
import { RouterModule } from '@angular/router';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

register();

@Component({
  selector: 'app-dashboard',
  imports: [MapComponent, Navbar, Sidebar, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  protected title = 'GPON';
  numberOfUsers: number = 0;
  percentageChange: number = 0;

  constructor(private readonly userService: UserService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userService.authState$.subscribe((authState) => {
      if (!authState.isLoading) {
        console.log("User logged in status:", authState.isLoggedIn);
        if (authState.isLoggedIn) {
          const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
          this.userService.countByCreatedAtAfter(yesterday).subscribe((countYesterday) => {
            this.numberOfUsers = countYesterday;
            const beforeYesterday = new Date();
            beforeYesterday.setDate(beforeYesterday.getDate() - 2);
            this.userService.countByCreatedAtAfter(beforeYesterday).subscribe((countBeforeYesterday) => {
              if (countBeforeYesterday > 0) {
                this.percentageChange = ((countYesterday - countBeforeYesterday) / countBeforeYesterday) * 100;
              } else {
                this.percentageChange = countYesterday > 0 ? 100 : 0;
              }
              this.changeDetectorRef.detectChanges();
            });
          });
        }
      }
    });
    
    this.chart1();
    this.carousel();
  }

  chart1() {
    const chartElement = document.getElementById("chart-line") as HTMLCanvasElement;
    if (chartElement) {
      const ctx1 = chartElement.getContext("2d");
      if (ctx1) {
        const gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
        gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
        gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
        gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');
        new Chart(ctx1, {
          type: "line",
          data: {
            labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
              label: "Mobile apps",
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 0,
              borderColor: "#5e72e4",
              backgroundColor: gradientStroke1,
              hoverBorderWidth: 3,
              fill: true,
              data: [50, 40, 300, 220, 500, 250, 400, 230, 500]

            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              }
            },
            interaction: {
              intersect: false,
              mode: 'index',
            },
            scales: {
              y: {
                grid: {
                  display: true,
                  drawOnChartArea: true,
                  drawTicks: false,
                },
                ticks: {
                  display: true,
                  padding: 10,
                  color: '#fbfbfb',
                  font: {
                    size: 11,
                    family: "Open Sans",
                    style: 'normal',
                    lineHeight: 2
                  },
                }
              },
              x: {
                grid: {
                  display: false,
                  drawOnChartArea: false,
                  drawTicks: false,
                },
                ticks: {
                  display: true,
                  color: '#ccc',
                  padding: 20,
                  font: {
                    size: 11,
                    family: "Open Sans",
                    style: 'normal',
                    lineHeight: 2
                  },
                }
              },
            },
          },
        });
      }
    }
  }

  carousel() {
    const slides = document.querySelectorAll("[slide]");
    
    slides.forEach((slide, indx) => {
      (slide as HTMLElement).style.transform = `translateX(${indx * 100}%)`;
    });
    const nextSlide = document.querySelector("[btn-next]");
    let curSlide = 0;
    let maxSlide = slides.length - 1;
    if (nextSlide) {
      nextSlide.addEventListener("click", function () {
        if (curSlide === maxSlide) {
          curSlide = 0;
        } else {
          curSlide++;
        }

        slides.forEach((slide, indx) => {
          (slide as HTMLElement).style.transform = `translateX(${100 * (indx - curSlide)}%)`;
        });
      });
    }

    const prevSlide = document.querySelector("[btn-prev]");

    if (prevSlide) {
      prevSlide.addEventListener("click", function () {
        if (curSlide === 0) {
          curSlide = maxSlide;
        } else {
          curSlide--;
        }

        slides.forEach((slide, indx) => {
          (slide as HTMLElement).style.transform = `translateX(${100 * (indx - curSlide)}%)`;
        });
      });
    }
  }
}