import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useLoginUserStore } from '@/stores/LoginStore'; // Import the store
import Header from '../Header.vue'; // Adjust path if necessary

// Mock vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      resolve: vi.fn(),
      currentRoute: { value: { path: '/', fullPath: '/', name: 'home' } },
    }),
    useRoute: () => ({
      path: '/',
      fullPath: '/',
      name: 'home',
    }),
  };
});

describe('Header.vue', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    // Initialize the store and set the loginUser value
    const loginUserStore = useLoginUserStore();
    // The store exposes 'loginUser' as a ref containing the username string.
    loginUserStore.$patch({ loginUser: 'Test User From Store' });
  });

  it('renders successfully', () => {
    // Pinia instance is already created and active from beforeEach
    // And the store is initialized with a username
    const wrapper = mount(Header, {
      global: {
        // Pinia plugin is automatically picked up from setActivePinia
        stubs: {
          'router-link': { template: '<a><slot /></a>' },
          'el-dropdown': { template: '<div><slot /><slot name="dropdown" /></div>' },
          'el-dropdown-menu': { template: '<div><slot /></div>' },
          'el-dropdown-item': { template: '<div><slot /></div>' },
          'el-avatar': { template: '<div><slot /></div>' },
          'el-icon': { template: '<i></i>' },
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
    // Optionally, you can add a more specific assertion here if the username is rendered
    // For example: expect(wrapper.text()).toContain('Test User From Store');
  });

  // Add more tests here if needed, for example:
  // it('displays the correct title', () => {
  //   const wrapper = mount(Header);
  //   expect(wrapper.find('h1').text()).toContain('Expected Title');
  // });
});
